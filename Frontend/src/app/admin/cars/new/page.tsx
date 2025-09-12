
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car, Check, UploadCloud } from 'lucide-react';

export default function NewCarPage() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary">Add New Car</h1>
                <p className="text-muted-foreground">Fill in the details to list a new car for booking, including pricing, availability, and car specifications.</p>
            </div>
            
            <div className="space-y-8">
                 <div>
                    <Label className="font-semibold mb-2 block">Upload a picture of your car</Label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                            <div className="text-center">
                                <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                         <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                            <div className="text-center">
                                <Car className="mx-auto h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" placeholder="e.g. BMW, Mercedes, Audi..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" placeholder="e.g. X5, E-Class, M4..." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" placeholder="2025" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Daily Price ($)</Label>
                        <Input id="price" type="number" placeholder="100" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
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
                         <Select>
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
                         <Select>
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
                        <Input id="seating" type="number" placeholder="5" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="eg. San Francisco, CA" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your car, its condition, and any notable details..." rows={4} />
                </div>
                
                <div className="flex justify-end">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        <Check className="mr-2 h-4 w-4" />
                        List Your Car
                    </Button>
                </div>
            </div>
        </div>
    )
}
