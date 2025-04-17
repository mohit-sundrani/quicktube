import axios, { isAxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("API URL not configured");
}

const authService = {
    async verifyToken(token: string) {
        try {
            const res = await axios.post(`${API_URL}/auth/verify-token`, {
                token: token,
            });
            return res.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(
                    (await error?.response?.data.message) ? error?.response?.data.message : "Internal server error"
                );
            } else {
                throw new Error("Something went wrong");
            }
        }
    },
    async signin(credentials: { email: string; password: string }) {
        try {
            const res = await axios.post(`${API_URL}/auth/signin`, credentials);
            localStorage.setItem("token", res.data.token);
            return res.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(
                    (await error?.response?.data.message) ? error?.response?.data.message : "Internal server error"
                );
            } else {
                throw new Error("Something went wrong");
            }
        }
    },

    async signup(credentials: { name: string; email: string; password: string }) {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, credentials);
            localStorage.setItem("token", res.data.token);
            return res.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(
                    (await error?.response?.data.message) ? error?.response?.data.message : "Internal server error"
                );
            } else {
                throw new Error("Something went wrong");
            }
        }
    },

    signout() {
        localStorage.removeItem("token");
    },

    getToken() {
        return localStorage.getItem("token");
    },
};

export default authService;
