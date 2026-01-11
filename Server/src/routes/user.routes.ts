import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/user.controller";
import { validateLogin, validateRegister } from "../validation/user.validation";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/auth/register", validateRegister, validationMiddleware, register);
router.post("/auth/login", validateLogin, validationMiddleware, login);
router.get("/auth/me", authMiddleware, getCurrentUser);

export default router;
