import { NextFunction, Response, Router } from "express";
import { createSummary, getSummary } from "../controllers/summaryController";
import authMiddleware from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "../lib/types";

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        return res.status(429).json({ message: "Too many requests, please try after 2 minutes" });
    },
});

const router = Router();

router.post("/create", authMiddleware, limiter, createSummary);
router.get("/:id", authMiddleware, getSummary);

export default router;
