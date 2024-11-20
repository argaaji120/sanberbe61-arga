import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";

const router = express.Router();

// Auth
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/me", authMiddleware, authController.me);
router.put("/auth/update-profile", authMiddleware, authController.updateProfile);

export default router;
