import { NextFunction, Response, Router } from "express";
import { signin, signup, verifyToken } from "../controllers/authController";
import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "../lib/types";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        return res.status(429).json({ message: "Too many requests, please try after 1 minute" });
    },
});

const router = Router();
// router.use(limiter);

router.post("/signin", limiter, signin);
router.post("/signup", limiter, signup);
router.post("/verify-token", verifyToken);

export default router;
