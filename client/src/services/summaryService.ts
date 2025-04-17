import axios, { isAxiosError } from "axios";
import { z } from "zod";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = authService.getToken();

if (!API_URL) {
    throw new Error("API URL not configured");
}

const summaryService = {
    async createSummary(link: string, tone: string, style: string, depth: string, length: number) {
        const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        const summarySchema = z.object({
            link: z.string().refine((link) => youtubeUrlRegex.test(link), {
                message: "Link must be a valid YouTube URL",
            }),
            tone: z.enum(["PROFESSIONAL", "CASUAL", "FRIENDLY"], { message: "Invalid tone" }),
            style: z.enum(["PARAGRAPHS", "POINTS"], { message: "Invalid style" }),
            depth: z.enum(["COMPREHENSIVE", "CONCISE"], { message: "Invalid depth" }),
            length: z
                .number({ message: "Length should be a number" })
                .int({ message: "Length should be a number" })
                .positive({ message: "Length should be a positive" })
                .min(250, { message: "Length should not be less than 250" })
                .max(1000, { message: "Length should not be more than 1000" }),
        });

        const validationResult = summarySchema.safeParse({ link, tone, style, depth, length });
        if (!validationResult.success) {
            throw new Error(validationResult.error.errors.map((error) => error.message).join(", "));
        }

        try {
            const res = await axios.post(
                `${API_URL}/summary/create`,
                {
                    link: link,
                    tone: tone.toUpperCase(),
                    style: style.toUpperCase(),
                    depth: depth.toUpperCase(),
                    length: Number(length),
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

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

    async getSummary(id: string) {
        const validationResult = z
            .string({ message: "Summary not found" })
            .length(24, { message: "Summary not found" })
            .safeParse(id);
        if (!validationResult.success) {
            throw new Error(validationResult.error.errors.map((error) => error.message).join(", "));
        }

        try {
            const res = await axios.get(`${API_URL}/summary/${id}`, {
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

export default summaryService;
