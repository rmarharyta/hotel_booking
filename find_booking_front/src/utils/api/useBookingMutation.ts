import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllBookings, getUserBookings, createBooking, deleteBooking } from "./bookingServices";
import { getBookingStatistics } from "./statisticsServices";

export function useBookings(isAdmin: boolean) { 
    return useQuery({
        queryKey: isAdmin ? ['allBookings'] : ['userBookings'],
        queryFn: isAdmin ? getAllBookings : getUserBookings,
    });
}

export function useBookingStatistics(hotelId: string, startDate: string, endDate: string) { 
    return useQuery({
        queryKey: ['bookingStatistics', hotelId, startDate, endDate],
        queryFn: () => getBookingStatistics(hotelId, startDate, endDate),
            enabled: !!hotelId && hotelId.trim().length > 0,
        staleTime: 0,
        retry: 1,
    });
}

export function useDeleteBooking() { 
    return useMutation({
        mutationFn: async (bookingId: string) => {
            await deleteBooking(bookingId);
            return bookingId;
        }, onError: (error) => {
            console.error("Error deleting booking:", error);
            throw error;
        }, onSuccess(booking) {
            console.log("Booking deleted:", booking);
        }
    });
}

export function useAddBooking() { 
    return useMutation({
        mutationFn: async ({ roomId, hotelName, checkInDate, checkOutDate, totalPrice }: { roomId: string, hotelName:string, checkInDate: string, checkOutDate: string, totalPrice: number }) => {
            const newBooking = await createBooking(roomId, hotelName, checkInDate, checkOutDate, totalPrice);
            return newBooking;
        }, onError: (error) => {
            console.error("Error creating booking:", error);
            throw error;
        }, onSuccess(booking) {
            console.log("Booking created:", booking);
        }
    });
}