'use server';
/**
 * @fileOverview A Genkit flow for retrieving car data.
 * This flow acts as the backend endpoint for the frontend to fetch car information.
 * It uses the car service to abstract the data source.
 *
 * - getAllCars - Fetches all cars.
 * - getCarById - Fetches a single car by its ID.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getCars, getCarById as getCarByIdFromService } from '@/services/car-service';
import { CarSchema } from '@/lib/types';

// Define a flow to get all cars
export async function getAllCars() {
    return await getAllCarsFlow();
}

const getAllCarsFlow = ai.defineFlow(
    {
        name: 'getAllCarsFlow',
        outputSchema: z.array(CarSchema),
    },
    async () => {
        return await getCars();
    }
);


// Define a flow to get a car by its ID
export async function getCarById(id: string) {
    return await getCarByIdFlow(id);
}

const getCarByIdFlow = ai.defineFlow(
    {
        name: 'getCarByIdFlow',
        inputSchema: z.string(),
        outputSchema: CarSchema.nullable(),
    },
    async (id) => {
        return await getCarByIdFromService(id);
    }
);
