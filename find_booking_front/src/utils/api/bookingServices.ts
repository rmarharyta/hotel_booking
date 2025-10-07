import axiosInstance from "./axios";

export type Booking = {
    Id: string,
    UserId: string,
    RoomId: string,
    CheckInDate: string,
    CheckOutDate: string,
    TotalPrice: number,
    CreatedAt: string,
}

export const getUserBookings = async (): Promise<Booking[]> => {
    try {
        const response = await axiosInstance.get(`/Booking/user_booking`)
        return response.data as Booking[];
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};

export const getAllBookings = async (): Promise<Booking[]> => {
    try {
        const response = await axiosInstance.get('/Booking/all');
        return response.data as Booking[];
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw error;
    }
};

export const getRoomBookings = async (roomId: string): Promise<Booking[]> => {
    try {
        const response = await axiosInstance.get(`/Booking/room/${roomId}`);
        return response.data as Booking[];
    } catch (error) {
        console.error("Error fetching room bookings:", error);
        throw error;
    }
};

export const createBooking = async (RoomId: string, CheckInDate: string, CheckOutDate: string, TotalPrice: number): Promise<Booking> => {
    try {
        const request = { RoomId, CheckInDate, CheckOutDate, TotalPrice };
        const response = await axiosInstance.post('/Booking', request);
        return response.data as Booking;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
};

export const deleteBooking = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/Booking/${id}`);
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw error;
    }
};