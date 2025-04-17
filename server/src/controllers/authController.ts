import { Request, Response } from "express";
import { db } from "../lib/db";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/token";
import { hashPassword } from "../lib/hash";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { resetCredits } from "../lib/credits";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT SECRET not configured");
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
    }

    try {
        const existingUser = await db.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingUser) {
            res.status(400).json({ message: "Email not registered" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(existingUser.id);
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: { name: existingUser.name, credits: existingUser.credits },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name) {
        res.status(400).json({ message: "Name is required" });
        return;
    }

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
    }

    try {
        const existingUser = await db.users.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
        }

        const newUser = await db.users.create({
            data: {
                name: name,
                email: email,
                password: await hashPassword(password),
            },
        });

        const token = generateToken(newUser.id);

        res.status(200).json({
            message: "Registration successful",
            token: token,
            user: { name: newUser.name, credits: newUser.credits },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    if (!token) {
        res.status(400).json({ message: "Token is required" });
    }

    try {
        jwt.verify(token, JWT_SECRET, async (error: VerifyErrors | null, user?: JwtPayload | string) => {
            if (error || typeof(user) === "string") {
                res.status(403).json({ message: "Forbidden" });
                return
            }

            await resetCredits(user?.id);

            const existingUser = await db.users.findUnique({
                where: {
                    id: (user as any).id,
                },
                select: { name: true, credits: true },
            });

            if (!existingUser) {
                res.status(403).json({ message: "Forbidden" });
            }

            res.status(200).json({ message: "Valid token", user: existingUser });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
