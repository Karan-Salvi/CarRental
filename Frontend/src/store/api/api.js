import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const BASE_URL = `${apiUrl}/api`;

// Get token from localStorage for auth
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Cars", "Bookings", "Auth"],
  endpoints: (builder) => ({
    // -------- Auth --------
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // -------- Cars --------
    // fetchCars: builder.query({
    //   query: () => "/cars",
    //   providesTags: ["Cars"],
    // }),
    fetchCars: builder.query({
      query: ({ location, category, available } = {}) => {
        // Build query string
        const params = new URLSearchParams();
        if (location) params.append("location", location);
        if (category) params.append("category", category);
        if (available !== undefined) params.append("available", available);
        const queryString = params.toString();
        return `/cars${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Cars"],
    }),
    fetchCar: builder.query({
      query: (id) => `/cars/${id}`,
      providesTags: ["Cars"],
    }),
    createCar: builder.mutation({
      query: (data) => ({
        url: "/cars",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cars"],
    }),
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cars"],
    }),

    // -------- Bookings --------
    fetchBookings: builder.query({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bookings"],
    }),
    approveBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Bookings"],
    }),
    rejectBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Bookings"],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Bookings"],
    }),
    completeBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useFetchCarsQuery,
  useFetchCarQuery,
  useCreateCarMutation,
  useDeleteCarMutation,
  useFetchBookingsQuery,
  useCreateBookingMutation,
  useApproveBookingMutation,
  useRejectBookingMutation,
  useCancelBookingMutation,
  useCompleteBookingMutation,
} = api;
