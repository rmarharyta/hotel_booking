import { useMutation, useQuery } from "@tanstack/react-query";
import { getHotels, createHotel, updateHotel, deleteHotel } from "./hotelServices";

export function useHotels() { 
    return useQuery({
        queryKey: ['hotels'],
        queryFn: getHotels,
    });
}

export function useDeleteHotel() { 
    return useMutation({
        mutationFn: async (hotelId: string) => {
            await deleteHotel(hotelId);
            return hotelId;
        }, onError: (error) => {
            console.error("Error deleting hotel:", error);
            throw error;
        }, onSuccess(hotel) {
            console.log("Hotel deleted:", hotel);
        }
    });
}

export function useAddHotel() { 
    return useMutation({
        mutationFn: async ({ name,city,address,description}:{ name: string, city: string, address: string, description: string }) =>
        {const newHotel = await createHotel(name, city, address, description);
        return newHotel;},
        onError: (error) => {
            console.error("Error creating hotel:", error);
            throw error;
        }, onSuccess(hotel) {
            console.log("Hotel created:", hotel);
        }
    });
}

export function useUpdateHotel() { 
    return useMutation({
        mutationFn: async ({ id, name, city, address, description }: { id: string, name: string, city: string, address: string, description: string }) => {
            await updateHotel(id, name, city, address, description);
            return { id, name, city, address, description };
        },
        onError: (error) => {
            console.error("Error updating hotel:", error);
            throw error;
        }, onSuccess(hotel) {
            console.log("Hotel updated:", hotel);
        }
    });
}