import axiosInstance from "./axios";

export type Hotel = {
    Id: string;
    Name: string;
    City: string;
    Address: string;
    Description: string;
    CreatedAt: string;
}

export const getHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await axiosInstance.get('/Hotels');
        return response.data as Hotel[];
    }
    catch (error) {
        console.error("Error fetching hotels:", error);
        throw error;
    }
}

export const createHotel = async (name:string, city:string, address:string, description:string): Promise<Hotel> => {
    try {
        const request ={name, city, address, description};
        const response = await axiosInstance.post('/Hotels', request);
        return response.data as Hotel;
    }
    catch (error) {
        console.error("Error creating hotel:", error);
        throw error;
    }
}

export const updateHotel = async (id: string, name: string, city: string, address: string, description: string): Promise<Hotel> => { 
    try {
        const request = { name, city, address, description };
        const response = await axiosInstance.put(`/Hotels/${id}`, request);
        return response.data as Hotel;
    } catch (error) {
        console.error("Error updating hotel:", error);
        throw error;
    }
}

export const deleteHotel = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/Hotels/${id}`);
    } catch (error) {
        console.error("Error deleting hotel:", error);
        throw error;
    }
}