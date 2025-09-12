"use client";
import { useFetchCarsQuery } from "@/store/api/api";
import React from "react";
import CarCard from "./car-card";

const Carlist = () => {
  const { data: cars, error, isLoading } = useFetchCarsQuery({});
  console.log("Fetched cars:", cars, error, isLoading);
  const listedCars = cars?.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {listedCars?.map((car: any, index: number) => (
        <CarCard key={index} car={car} />
      ))}
    </div>
  );
};

export default Carlist;
