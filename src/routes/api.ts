import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
import categoryController from "../controllers/category.controller";

const router = express.Router();

// Auth
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/me", authMiddleware, authController.me);
router.put("/auth/update-profile", authMiddleware, authController.updateProfile);

// Categories
router.get("/categories", categoryController.findAll);
router.post("/categories", categoryController.create);
router.get("/categories/:id", categoryController.findOne);
router.put("/categories/:id", categoryController.update);
router.delete("/categories/:id", categoryController.delete);

export default router;
