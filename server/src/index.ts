import { config } from "dotenv";
config();

if (!process.env.PORT) {
    throw new Error("PORT not configured");
}

const PORT = Number(process.env.PORT);

if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND URL not configured");
}

const FRONTEND_URL = process.env.FRONTEND_URL;

import express from "express";
import cors from "cors";
import routes from "./routes/index";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: FRONTEND_URL,
        methods: "GET,POST",
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 204,
    })
);
app.use(morgan("dev"));

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
