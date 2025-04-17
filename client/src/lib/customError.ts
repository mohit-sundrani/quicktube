import { CustomError } from "./types";

const isCustomError = (error: unknown): error is CustomError => {
    return error instanceof Error && "message" in error;
};

export default isCustomError;
