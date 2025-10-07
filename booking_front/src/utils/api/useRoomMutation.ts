import { useMutation, useQuery } from "@tanstack/react-query";
import { getHotelRooms, getAllRooms, createRoom, updateRoom, deleteRoom } from "./roomServices";

export function useRooms(hotelId?: string) { 
    return useQuery({
        queryKey: hotelId ? ['rooms', hotelId] : ['rooms'],
        queryFn: hotelId ? () => getHotelRooms(hotelId) : getAllRooms,
    });
}
export function useDeleteRoom() { 
    return useMutation({
        mutationFn: async (roomId: string) => {
            await deleteRoom(roomId);
            return roomId;
        }, onError: (error) => {
            console.error("Error deleting room:", error);
            throw error;
        }, onSuccess(room) {
            console.log("Room deleted:", room);
        }
    });
}
export function useAddRoom() { 
    return useMutation({
        mutationFn: async ({ hotelId, roomNumber, capacity, pricePerNight }: { hotelId: string, roomNumber: string, capacity: number, pricePerNight: number }) => {
            const newRoom = await createRoom(hotelId, roomNumber, capacity, pricePerNight);
            return newRoom;
        }, onError: (error) => {
            console.error("Error creating room:", error);
            throw error;
        }, onSuccess(room) {
            console.log("Room created:", room);
        }
    });
}

export function useUpdateRoom() { 
    return useMutation({
        mutationFn: async ({ id, roomNumber, capacity, pricePerNight }: { id: string, roomNumber: string, capacity: number, pricePerNight: number }) => {
            await updateRoom(id, roomNumber, capacity, pricePerNight);
            return { id, roomNumber, capacity, pricePerNight };
        }, onError: (error) => {
            console.error("Error updating room:", error);
            throw error;
        }, onSuccess(room) {
            console.log("Room updated:", room);
        }
    });
}