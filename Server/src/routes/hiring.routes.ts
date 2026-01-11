import { Router } from "express"
import type { Request, Response } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { hireBid } from "../controllers/hiring.controller"

const router = Router()

router.patch("/bids/:bidId/hire",authMiddleware, hireBid);

export default router