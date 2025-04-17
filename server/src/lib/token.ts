import jwt, { VerifyErrors } from "jsonwebtoken";

export const generateToken = (id: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret not configured");
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign({ id }, JWT_SECRET as string, { expiresIn: "7d" });
};
