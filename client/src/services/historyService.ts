import axios, { isAxiosError } from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = authService.getToken();

if (!API_URL) {
    throw new Error("API URL not configured");
}

const historyService = {
    async getHistory() {
        try {
            const res = await axios.get(`${API_URL}/history`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
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
};

export default historyService;
