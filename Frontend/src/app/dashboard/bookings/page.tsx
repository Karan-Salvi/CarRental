
'use client';

import Image from 'next/image';
import { bookings, cars } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import type { Booking, Car } from '@/lib/types';
import { Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserBookingsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userBookings = bookings.filter(b => b.userId === 'u1'); // Mocking for one user

  const getStatusClass = (status: Booking['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };
  
  const getStatusBorderClass = (status: Booking['status']) => {
    switch (status) {
      case 'accepted':
        return 'border-green-500';
      default:
        return 'border-transparent';
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your car bookings</p>
      </div>

      {userBookings.length > 0 ? (
        <div className="space-y-6">
          {userBookings.map((booking) => {
            const car = cars.find(c => c.id === booking.carId);
            if (!car) return null;
            return (
              <div key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill className="object-cover" data-ai-hint={`${car.make} ${car.type}`} />
                    </div>
                    <h3 className="font-bold text-primary">{car.make} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year} &middot; {car.type} &middot; {car.location}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                             <h4 className="font-semibold text-gray-600 dark:text-gray-300">Booking #{booking.id}</h4>
                             <Badge variant="outline" className={`capitalize ${getStatusClass(booking.status)} ${getStatusBorderClass(booking.status)}`}>{booking.status}</Badge>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">Rental Period</p>
                                {isClient ? <p>{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</p> : <p>&nbsp;</p>}
                            </div>
                        </div>
                         <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">Pick-up Location</p>
                                <p>Airport Terminal 1</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                            <div>
                                <p className="font-medium text-foreground">Return Location</p>
                                <p>Downtown Office</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-2xl font-bold text-primary">${booking.totalPrice.toFixed(2)}</p>
                        {isClient ? <p className="text-xs text-muted-foreground">Booked on {booking.startDate.toLocaleDateString()}</p> : <p className="text-xs text-muted-foreground">&nbsp;</p>}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-2xl bg-white">
          <p className="text-muted-foreground">You have no bookings yet.</p>
        </div>
      )}
    </div>
  );
}
