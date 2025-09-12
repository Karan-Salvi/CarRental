"use client";

import { useState, useEffect, useMemo } from "react";
import CarCard from "@/components/car-card";
import { getAllCars } from "@/ai/flows/get-cars-flow";
import type { Car } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { ListFilter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CarListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CarsPage() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [carType, setCarType] = useState("all");

  useEffect(() => {
    async function fetchCars() {
      try {
        const fetchedCars = await getAllCars();
        setAllCars(fetchedCars);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const matchesSearch =
        searchTerm.toLowerCase() === "" ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.features.some((f) =>
          f.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType = carType === "all" || car.type === carType;

      return matchesSearch && matchesType;
    });
  }, [allCars, searchTerm, carType]);

  const carTypes = useMemo(() => {
    const types = new Set(allCars.map((car) => car.type));
    return ["all", ...Array.from(types)];
  }, [allCars]);

  return (
    <div className="bg-slate-50/50 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-primary mb-2">
            Available Cars
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of premium vehicles available for your next
            adventure
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, or features"
              className="pl-10 h-12 rounded-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={carType} onValueChange={setCarType}>
            <SelectTrigger className="h-12 rounded-full shadow-sm text-muted-foreground">
              <SelectValue placeholder="Car Type" />
            </SelectTrigger>
            <SelectContent>
              {carTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredCars.length} Cars
          </p>
        </div>

        {loading ? (
          <CarListSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-auto">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
