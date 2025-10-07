import axiosInstance from "./axios";

export type Room = {
    Id: string,
    HotelId: string,
    RoomNumber: string,
    Capacity: number,
    PricePerNight: number,
}

export const getHotelRooms = async (hotelId: string): Promise<Room[]> => {
    try {
        const response = await axiosInstance.get(`/Rooms/get_by_hotels`, { params: { hotelId } });
        return response.data as Room[];
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

export const getAllRooms = async (): Promise<Room[]> => {
    try {
        const response = await axiosInstance.get('/Rooms/get_all');
        return response.data as Room[];
    } catch (error) {
        console.error("Error fetching all rooms:", error);
        throw error;
    }
};

export const createRoom = async (hotelId: string, roomNumber: string, capacity: number, pricePerNight: number): Promise<Room> => {
    try {
        const request = { roomNumber, capacity, pricePerNight };
        const response = await axiosInstance.post(`/Rooms/${hotelId}`, request);
        return response.data as Room;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};

export const updateRoom = async (id: string, roomNumber: string, capacity: number, pricePerNight: number): Promise<Room> => {
    try {
        const request = { roomNumber, capacity, pricePerNight };
        const response = await axiosInstance.put(`/Rooms/${id}`, request);
        return response.data as Room;
    } catch (error) {
        console.error("Error updating room:", error);
        throw error;
    }
};

export const deleteRoom = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/Rooms/${id}`);
    } catch (error) {
        console.error("Error deleting room:", error);
        throw error;
    }
};