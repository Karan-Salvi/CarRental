import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Fuel, Cog, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

interface CarCardProps {
  car: Car;
}

function formatDateWithDay(timestamp: string) {
  const date = new Date(timestamp);

  const options = {
    weekday: "long", // e.g., Monday
    year: "numeric",
    month: "short", // e.g., Sep
    day: "numeric", // e.g., 12
  };

  return date.toLocaleDateString("en-US", options);
}

export default function CarCard({ car }: any) {
  
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border bg-card">
      <Link href={`/cars/${car._id}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <Image
            src={car?.image || "/images/car1.png"}
            alt={`${car.make} ${car.model}`}
            data-ai-hint={`${car.make} ${car.type}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-black/60 text-white text-sm font-bold px-3 py-1 rounded-full">
            ${car.dailyPrice}/day
          </div>
          {car.availability && (
            <Badge className="absolute top-3 left-3 bg-blue-500 text-white border-blue-500">
              Available Now
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 bg-white">
        <h3 className="text-lg font-bold text-primary">
          <Link href={`/cars/${car._id}`} className="hover:underline">
            <span className="text-xs text-muted-foreground">
              {formatDateWithDay(car?.createdAt)}
            </span>
            <br />
            {car?.model}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {car?.category?.toUpperCase()} &bull; {car?.year}
        </p>

        <Link
          href={`/cars/${car._id}`}
          className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground pt-4 mt-4"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{car?.seatingCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-primary" />
            <span>{car?.fuelType?.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cog className="w-4 h-4 text-primary" />
            <span>{car?.transmission?.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{car.location}</span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
