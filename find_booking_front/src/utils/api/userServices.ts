import axiosInstance from "./axios";

type LoginResponse = {
    Id: string,
    RoleId: number
}

export const register = async (email: string, password: string) :Promise<LoginResponse> => {
    try {
        if (!email || !password) throw new Error("email and password are required");
        const user = {email, password };
        const response = await axiosInstance.post("/Users/registration", user);
        return response.data as LoginResponse;
    } catch (error) {
        console.error(error)
        throw error;   
    }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        if (!email || !password) throw new Error("email and password are required");
        const user = { Email: email, Password: password };
        const response = await axiosInstance.post("/Users/login", user);
        return response.data as LoginResponse;
    } catch (error) {
        console.error(error)
        throw error;
    }
}
export const logout = async () => {
    try {
        await axiosInstance.post(`/Users/logout`);
    } catch (e) {
        console.error(e);
    }
}

export const getUserDetails = async (): Promise<{ Id: string; RoleId: number }> => {
    try {
        const response = await axiosInstance.get(`/Users/me`);
        console.log("User details response:", response.data);
        return response.data as { Id: string; RoleId: number };
    } catch (e) {
        console.error(e as Error);
        throw e;
    }
}