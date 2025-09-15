"use client";

import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MapPin,
  ArrowLeft,
  Users,
  Fuel,
  Cog,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { getCarById } from "@/ai/flows/get-cars-flow";
import { useEffect, useState } from "react";
import type { Car } from "@/lib/types";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBookingMutation, useFetchCarQuery } from "@/store/api/api";
import { useSelector } from "react-redux";

export default function CarDetailsPage() {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const { data: car, error, isLoading, isError } = useFetchCarQuery(params.id);
  const [
    createBooking,
    {
      isLoading: isBookingLoading,
      isSuccess: isBookingSuccess,
      isError: isBookingError,
      error: bookingError,
    },
  ] = useCreateBookingMutation();

  const featureIcons = {
    Seats: <Users className="w-6 h-6 text-primary" />,
    Hybrid: <Fuel className="w-6 h-6 text-primary" />,
    Electric: <Fuel className="w-6 h-6 text-primary" />,
    Gasoline: <Fuel className="w-6 h-6 text-primary" />,
    Automatic: <Cog className="w-6 h-6 text-primary" />,
    Manual: <Cog className="w-6 h-6 text-primary" />,
    Location: <MapPin className="w-6 h-6 text-primary" />,
  };

  const mainFeatures = [
    {
      label: car?.seatingCapacity,
      icon: featureIcons.Seats,
    },
    {
      label: car?.fuelType?.toUpperCase(),
      icon: featureIcons.Hybrid,
    },
    {
      label: car?.transmission?.toUpperCase(),
      icon: featureIcons.Automatic,
    },
    { label: car?.location, icon: featureIcons.Location },
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    const bookingData = {
      carId: params?.id,
      startDate: pickupDate,
      endDate: returnDate,
    };

    try {
      const result = await createBooking(bookingData).unwrap();
    } catch (err) {
      console.error("Failed to create booking:", err);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-primary mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all cars</span>
        </Link>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Image and Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-video relative mb-8">
              <Image
                src={car?.image || "/images/car1.png"}
                alt={` ${car?.model} view`}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary">
              {/* {car.make}  */}
              {car?.model}
            </h1>
            <p className="text-xl font-medium text-muted-foreground mt-1">
              {car?.transmission?.toUpperCase()} • {car?.year}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              {mainFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-slate-50 border-none p-4 flex flex-col items-center justify-center gap-2 text-center"
                >
                  {feature.icon}
                  <span className="text-sm font-medium text-muted-foreground">
                    {feature.label}
                  </span>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary normal-case mb-2">
                  Description
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {car?.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary normal-case mb-4">
                  Owner Details
                </h2>
                <p className="text-foreground/80">
                  Owner Name: {car?.owner?.name}
                </p>

                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-foreground">
                  {car?.features?.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between text-primary normal-case">
                  <span className="text-3xl font-bold text-primary">
                    ₹ {car?.dailyPrice}
                  </span>
                  <span className="text-base font-normal text-muted-foreground">
                    per day
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleBooking}>
                  <div className="grid gap-2">
                    <Label htmlFor="pickup-date">Pickup Date</Label>
                    <div className="relative">
                      <Input
                        id="pickup-date"
                        type="date"
                        className="pr-10"
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="return-date">Return Date</Label>
                    <div className="relative">
                      <Input
                        id="return-date"
                        type="date"
                        className="pr-10"
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button
                    disabled={!car?.isAvailable}
                    className="w-full text-lg h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isBookingLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {!user
                      ? "Login to Book"
                      : isBookingSuccess
                      ? "Booked"
                      : car?.isAvailable
                      ? "Book Now"
                      : "Unavailable"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  No credit card required to reserve
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
