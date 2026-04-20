import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getLogout,
  loginUser,
  getCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", getLogout);
router.get("/user", protect, getCurrentUser);

export default router;
