import { Request, Response, Router } from "express";
import authRoutes from "./authRoutes";
import summaryRoutes from "./summaryRoutes";
import historyRoutes from "./historyRoutes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World" });
});

router.use("/auth", authRoutes);
router.use("/summary", summaryRoutes);
router.use("/history", historyRoutes);

export default router;
