
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cars as initialCars } from '@/lib/placeholder-data';
import { MoreHorizontal, PlusCircle, Trash2, Eye } from 'lucide-react';
import type { Car } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>(initialCars);

  const getCarFeatures = (car: Car) => {
      const seats = car.features.find(f => f.toLowerCase().includes('seat'))?.split(' ')[0] || 'N/A';
      const transmission = car.features.find(f => f.toLowerCase().includes('automatic') || f.toLowerCase().includes('manual')) || 'Automatic';
      return `${seats} seats · ${transmission}`;
  }

  return (
    <div className="space-y-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <Table>
            <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-800">
                <TableHead className="text-gray-600 dark:text-gray-400">Car</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400">Category</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400">Price</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cars.map((car) => (
                <TableRow key={car.id} className="border-gray-200 dark:border-gray-800">
                    <TableCell>
                        <div className="flex items-center gap-4">
                            <Image src={car.images[0]} alt={car.make} width={80} height={60} className="rounded-md object-cover" data-ai-hint={`${car.make} ${car.model}`} />
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{car.make} {car.model}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{getCarFeatures(car)}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{car.type}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">${car.pricePerDay}/day</TableCell>
                    <TableCell>
                    <Badge variant={car.availability ? 'default' : 'destructive'} 
                        className={cn(car.availability ? 
                        'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : 
                        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800', 
                        'font-medium')}>
                        {car.availability ? 'Available' : 'Not Available'}
                    </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                                <Eye className="h-5 w-5" />
                                <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
    </div>
  );
}
