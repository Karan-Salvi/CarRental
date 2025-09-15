// server.js
// Single-file Express + Mongoose backend for car-rental booking with concurrency controls.
// Install: npm i express mongoose bcryptjs jsonwebtoken dotenv body-parser

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/car_rental";
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URI,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* -----------------------------
   Mongoose Models (in-file)
   ----------------------------- */
const { Schema } = mongoose;

/* User Schema */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["owner", "renter", "admin"],
      default: "renter",
    },
    cars: [{ type: Schema.Types.ObjectId, ref: "Car" }],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

/* Car Schema */
const carSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    dailyPrice: { type: Number, required: true },
    category: {
      type: String,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Coupe",
        "Convertible",
        "Pickup",
        "Van",
        "Other",
      ],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "Other"],
      required: true,
    },
    seatingCapacity: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

/* Booking Schema */
const bookingSchema = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// NOTE: range uniqueness is not trivial with Mongo; we handle overlap checks in transactions.
const Booking = mongoose.model("Booking", bookingSchema);

/* -----------------------------
   Express App + Middleware
   ----------------------------- */
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

/* Auth middleware */
function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required)
        return res
          .status(401)
          .json({ message: "Missing Authorization header" });
      req.user = null;
      return next();
    }
    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid Authorization header" });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: err.message });
    }
  };
}

/* Simple role check */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}

/* -----------------------------
   Auth Routes
   ----------------------------- */

/** Register */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });
    const user = new User({ name, email, password, phone, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

/** Login */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
    console.log("Password:", password);
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

/* -----------------------------
   Car Routes
   ----------------------------- */

/** Create car (owner only) */
// app.post("/api/cars", auth(), requireRole("owner"), async (req, res) => {
//   try {
//     const payload = { ...req.body, owner: req.user._id };
//     const car = new Car(payload);
//     await car.save();
//     // add to owner's cars
//     req.user.cars.push(car._id);
//     await req.user.save();
//     res.status(201).json(car);
//   } catch (err) {
//     res.status(500).json({ message: "Create car failed", error: err.message });
//   }
// });

app.post("/api/cars", auth(), requireRole("owner"), async (req, res) => {
  try {
    const {
      _id,
      brand,
      model,
      year,
      dailyPrice,
      category,
      transmission,
      fuelType,
      seatingCapacity,
      location,
      description,
      image,
    } = req.body;

    let owner = req.user._id;

    let car;

    if (_id) {
      // If car id is provided, try update
      car = await Car.findByIdAndUpdate(
        _id,
        {
          owner,
          brand,
          model,
          year,
          dailyPrice,
          category,
          transmission,
          fuelType,
          seatingCapacity,
          location,
          description,
          image,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } else {
      // If no id, check if same owner already has car with same brand+model+year
      car = await Car.findOneAndUpdate(
        { owner, brand, model, year },
        {
          owner,
          brand,
          model,
          year,
          dailyPrice,
          category,
          transmission,
          fuelType,
          seatingCapacity,
          location,
          description,
          image,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete a car
app.delete("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** List cars (public) */
app.get("/api/cars", async (req, res) => {
  try {
    const { location, category, available } = req.query;
    const q = {};
    if (location) q.location = location;
    if (category) q.category = category;
    if (available !== undefined) q.isAvailable = available === "true";
    const cars = await Car.find(q).populate("owner", "name email");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "List cars failed", error: err.message });
  }
});

/** Get single car */
app.get("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Get car failed", error: err.message });
  }
});

/* -----------------------------
   Booking Routes
   ----------------------------- */

/** Create booking (renter) -> status "pending" */
app.post("/api/bookings", auth(), requireRole("renter"), async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    if (!carId || !startDate || !endDate)
      return res.status(400).json({ message: "Missing fields" });

    const car = await Car.findById(carId).populate("owner");
    if (!car) return res.status(404).json({ message: "Car not found" });

    const sd = new Date(startDate);
    const ed = new Date(endDate);
    if (ed <= sd)
      return res
        .status(400)
        .json({ message: "endDate must be after startDate" });

    const days = Math.ceil((ed - sd) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.dailyPrice;

    const booking = new Booking({
      car: car._id,
      renter: req.user._id,
      owner: car.owner._id,
      startDate: sd,
      endDate: ed,
      totalPrice,
      status: "pending",
    });

    await booking.save();
    // push to user bookings
    req.user.bookings.push(booking._id);
    await req.user.save();

    res.status(201).json({
      message: "Booking created (pending). Owner must approve.",
      booking,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Create booking failed", error: err.message });
  }
});

/** Owner: Approve booking -> use transaction to prevent overlaps */
app.patch("/api/bookings/:id/approve", auth(), async (req, res) => {
  const bookingId = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Booking not found" });
    }
    // check owner
    if (
      String(booking.owner) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Only owner/admin can approve" });
    }
    if (booking.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: `Booking is already ${booking.status}` });
    }

    // Overlap check: look for any approved booking for same car that overlaps
    const overlap = await Booking.findOne({
      car: booking.car,
      status: "approved",
      $or: [
        {
          startDate: { $lte: booking.endDate },
          endDate: { $gte: booking.startDate },
        }, // any overlap
      ],
    }).session(session);

    if (overlap) {
      // If overlap exists, reject approval
      booking.status = "rejected";
      await booking.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(409).json({
        message:
          "Car already approved for an overlapping period. Booking rejected automatically.",
      });
    }

    // No overlap -> approve booking
    booking.status = "approved";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Booking approved", booking });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Approve failed", error: err.message });
  }
});

/** Owner: Reject booking */
app.patch("/api/bookings/:id/reject", auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      String(booking.owner) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Only owner/admin can reject" });
    }
    if (booking.status !== "pending")
      return res
        .status(400)
        .json({ message: `Booking is already ${booking.status}` });
    booking.status = "rejected";
    await booking.save();
    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).json({ message: "Reject failed", error: err.message });
  }
});

/** Renter: Cancel booking (if pending or approved, before startDate) */
app.patch("/api/bookings/:id/cancel", auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      String(booking.renter) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Only renter/admin can cancel" });
    }
    if (
      booking.status === "completed" ||
      booking.status === "cancelled" ||
      booking.status === "rejected"
    ) {
      return res.status(400).json({
        message: `Cannot cancel booking with status ${booking.status}`,
      });
    }
    const now = new Date();
    if (now >= booking.startDate)
      return res
        .status(400)
        .json({ message: "Cannot cancel after booking start date" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed", error: err.message });
  }
});

/** Mark booking completed (owner/admin) - optionally can be automatic via cron when endDate passes */
app.patch("/api/bookings/:id/complete", auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      String(booking.owner) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Only owner/admin can complete" });
    }
    if (booking.status !== "approved")
      return res
        .status(400)
        .json({ message: "Only approved bookings can be completed" });
    booking.status = "completed";
    await booking.save();
    res.json({ message: "Booking completed", booking });
  } catch (err) {
    res.status(500).json({ message: "Complete failed", error: err.message });
  }
});

/** Get bookings for current user (renter or owner) */
app.get("/api/bookings", auth(), async (req, res) => {
  try {
    const q = {};
    if (req.user.role === "renter") q.renter = req.user._id;
    else if (req.user.role === "owner") q.owner = req.user._id;
    // admin -> get all
    const bookings = await Booking.find(q)
      .populate("car")
      .populate("renter", "name email")
      .populate("owner", "name email");
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "List bookings failed", error: err.message });
  }
});

/* -----------------------------
   Utility / Health
   ----------------------------- */
app.get("/api/health", (req, res) => res.json({ ok: true, now: new Date() }));

/* -----------------------------
   Connect DB & Start
   ----------------------------- */
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");
    app.listen(PORT || 10000, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start", err);
    process.exit(1);
  }
}

start();
