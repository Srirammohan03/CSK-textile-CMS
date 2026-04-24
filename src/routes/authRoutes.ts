import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getLogout,
  loginUser,
  getCurrentUser,
  addUsers,
  getAllusers,
  editUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", getLogout);
router.get("/user", protect, getCurrentUser);
router.post("/register", addUsers);
router.post("/add-user", protect, addUsers);
router.get("/all-users", protect, getAllusers);
router.put("/update-user/:id", protect, editUser);
router.delete("/delete-user/:id", protect, deleteUser);

export default router;
