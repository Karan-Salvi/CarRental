"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCarMutation } from "@/store/api/api";
import { Car, Check, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
function convertDriveLink(viewLink: String) {
  // Extract the file ID from the link
  const match = viewLink.match(/\/d\/(.*?)\//);
  if (!match || !match[1]) {
    throw new Error("Invalid Google Drive link");
  }
  const fileId = match[1];

  // Return the direct download link
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export default function NewCarPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(
    "https://drive.google.com/file/d/1krceX3vqMacSWnoDX0nCV1N3TFEVfwfo/view?usp=sharing"
  );

  const [createCar, { isLoading, isError, isSuccess, error }] =
    useCreateCarMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const carData = {
      brand,
      model,
      year: parseInt(year),
      dailyPrice: parseFloat(dailyPrice),
      category,
      transmission,
      fuelType,
      seatingCapacity: parseInt(seatingCapacity),
      location,
      description,
      image: convertDriveLink(image),
    };

    try {
      const result = await createCar(carData).unwrap(); // unwrap for direct response or throw error
      
    } catch (err) {
      console.error("Failed to create car:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Add New Car</h1>
        <p className="text-muted-foreground">
          Fill in the details to list a new car for booking, including pricing,
          availability, and car specifications.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <Label className="font-semibold mb-2 block">
            Upload a picture of your car
          </Label>

          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              <Image
                src={convertDriveLink(image)}
                alt="Car"
                width={120}
                height={120}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-muted-foreground">Enter Image link:</p>
              <Input
                placeholder="https://source.unsplash.com/random.com"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. BMW, Mercedes, Audi..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. X5, E-Class, M4..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              onChange={(e) => setYear(e.target.value)}
              type="number"
              placeholder="2025"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Daily Price (₹)</Label>
            <Input
              id="price"
              type="number"
              placeholder="100"
              onChange={(e) => setDailyPrice(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Sedan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select onValueChange={(value) => setTransmission(value)}>
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Automatic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fuel">Fuel Type</Label>
            <Select onValueChange={(value) => setFuelType(value)}>
              <SelectTrigger id="fuel">
                <SelectValue placeholder="Diesel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="seating">Seating Capacity</Label>
            <Input
              id="seating"
              type="number"
              placeholder="5"
              onChange={(e) => setSeatingCapacity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="eg. Pune, Mumbai, Bangalore..."
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your car, its condition, and any notable details..."
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Check className="mr-2 h-4 w-4" />
            List Your Car
          </Button>
        </div>
      </form>
    </div>
  );
}
