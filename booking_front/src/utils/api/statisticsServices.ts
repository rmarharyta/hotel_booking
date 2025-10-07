import axiosInstance from "./axios";

export type BookingStatistics = {
    hotelName: string;
    totalBookings: number;
    totalRevenue: number;
    firstBooking: string | null;
    lastBooking: string | null;
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