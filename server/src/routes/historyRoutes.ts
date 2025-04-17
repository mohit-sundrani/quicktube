import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getHistory } from "../controllers/historyController";

const router = Router();

router.get("/", authMiddleware, getHistory);

export default router;
