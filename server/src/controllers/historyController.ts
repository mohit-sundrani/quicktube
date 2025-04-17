import { Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import { db } from "../lib/db";

export const getHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    try {
        const history = await db.users.findUnique({
            where: {
                id: req.user,
            },
            select: {
                createdSummaries: {
                    select: { id: true, title: true, channel: true },
                },
            },
        });
        res.status(200).json({ message: "History retrieved", history: history?.createdSummaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
