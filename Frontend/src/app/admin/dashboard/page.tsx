"use client";

import { bookings, cars } from "@/lib/placeholder-data";
import { useFetchBookingsQuery, useFetchCarsQuery } from "@/store/api/api";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Activity,
  Bell,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

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

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false);

  const {
    data: bookings,
    error,
    isLoading,
    isFetching,
  } = useFetchBookingsQuery();

  console.log("Bookings data:", bookings, error, isLoading, isFetching);

  const {
    data: cars,
    error: carError,
    isLoading: carLoading,
  } = useFetchCarsQuery({});
  console.log("Fetched cars:", cars, error, isLoading);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalRevenue = bookings
    ?.filter((b) => b.status === "completed")?
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Sales
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹ {totalRevenue?.toLocaleString()}
          </p>
          {/* <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +12% from last month
          </p> */}
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Active Bookings
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookings?.filter((b) => b.status === "approved")?.length}
          </p>
          {/* <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +5% from last week
          </p> */}
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Pending Bookings
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookings?.filter((b) => b.status === "pending")?.length}
          </p>
          {/* <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +8% from yesterday
          </p> */}
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Cars
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {cars?.length}
          </p>
          {/* <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +3 new this week
          </p> */}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Bookings
              </h3>
              <Link href="/admin/bookings" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {isClient &&
                bookings?.slice(0, 5).map((booking:any, i:number) => {
                 
                  return (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div
                        className={
                          "p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                        }
                      >
                        <DollarSign
                          className={
                            "h-4 w-4 text-green-600 dark:text-green-400"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          New booking for {booking?.car?.make} {booking?.car?.model}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {booking?.status}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDateWithDay(booking?.startDate)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  3.2%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "32%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  45%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page Views
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  8.7k
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>
          </div> */}

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Top Models
            </h3>
            <div className="space-y-3">
              {cars?.slice(0, 4).map((car, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {car.model}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ₹ {car?.dailyPrice}/day
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
