"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bookings as initialBookings, cars } from "@/lib/placeholder-data";
import { MoreHorizontal, Check, X } from "lucide-react";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  useApproveBookingMutation,
  useCompleteBookingMutation,
  useFetchBookingsQuery,
  useRejectBookingMutation,
} from "@/store/api/api";

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

export default function AdminBookingsPage() {
  // const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isClient, setIsClient] = useState(false);

  const {
    data: bookings,
    error,
    isLoading,
    isFetching,
  } = useFetchBookingsQuery();

  

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [approveBooking, { isLoading: approving }] =
    useApproveBookingMutation();
  const [rejectBooking, { isLoading: rejecting }] = useRejectBookingMutation();

  const [completeBooking, { isLoading: completing }] =
    useCompleteBookingMutation();

  const handleComplete = async (bookingId: string) => {
    try {
      await completeBooking(bookingId).unwrap();
      alert("Booking marked as completed ✅");
    } catch (error) {
      console.error("Failed to complete booking:", error);
      alert("Something went wrong ❌");
    }
  };

  const handleApprove = async (bookingId: string) => {
    try {
      await approveBooking(bookingId).unwrap();
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await rejectBooking(bookingId).unwrap();
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  const handleBookingStatusChange = (
    bookingId: string,
    status: "accepted" | "rejected"
  ) => {
    // setBookings((currentBookings) =>
    //   currentBookings.map((booking) =>
    //     booking.id === bookingId ? { ...booking, status: status } : booking
    //   )
    // );
  };

  const getStatusClass = (status: any) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-800">
              <TableHead className="text-gray-600 dark:text-gray-400">
                Car
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">
                Date Range
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">
                Total
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-400">
                Status
              </TableHead>
              <TableHead className="text-right text-gray-600 dark:text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking: any) => {
              return (
                <TableRow
                  key={booking?._id}
                  className="border-gray-200 dark:border-gray-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {booking?.car && (
                        <Image
                          src={booking?.car?.image || "/images/car1.png"}
                          alt={booking?.car?.model || "Car Image"}
                          width={64}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      )}
                      <span className="font-medium">
                        {booking?.car
                          ? `${booking?.car?.model} (${booking?.car?.year})`
                          : "Unknown Car"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isClient
                      ? `${formatDateWithDay(
                          booking?.startDate
                        )} to ${formatDateWithDay(booking?.endDate)}`
                      : ""}
                  </TableCell>
                  <TableCell>${booking?.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize font-medium",
                        getStatusClass(booking?.status)
                      )}
                      variant="outline"
                    >
                      {booking?.status === "accepted"
                        ? "Confirmed"
                        : booking?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="sm"
                          variant="outline"
                        >
                          Actions
                          <MoreHorizontal className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      >
                        {booking.status === "pending" ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(booking._id)}
                              className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <Check className="h-4 w-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleReject(booking._id);
                              }}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4 mr-2" /> Reject
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                            View Details
                          </DropdownMenuItem>
                        )}
                        {booking.status === "approved" && (
                          <DropdownMenuItem
                            className="text-green-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-gray-800"
                            onClick={() => handleComplete(booking._id)}
                          >
                            Complete Booking
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
