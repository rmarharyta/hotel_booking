import axiosInstance from "./axios";

export type BookingStatistics = {
    HotelName: string;
    TotalBookings: number;
    TotalRevenue: number;
    FirstBooking: string | null;
    LastBooking: string | null;
}

export const getBookingStatistics = async (hotelId: string, startDate: string, endDate: string): Promise<BookingStatistics[]> => {
    try {
        const response = await axiosInstance.get('/BookingStatistics/Hotel', { params: { hotelId, startDate, endDate } });
        return response.data as BookingStatistics[];
    } catch (error) {
        console.error("Error fetching booking statistics:", error);
        throw error;
    }
};