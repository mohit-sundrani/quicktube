import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { db } from "../lib/db";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!, async (error: VerifyErrors | null, user?: JwtPayload | string) => {
            if (error || typeof(user) === "string") {
                return res.status(403).json({ message: "Forbidden" });
            }

            const existingUser = await db.users.findUnique({
                where: {
                    id: user?.id,
                },
            });

            if (!existingUser) {
                return res.status(403).json({ message: "Forbidden" });
            }

            req.user = existingUser.id;
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default authMiddleware;
