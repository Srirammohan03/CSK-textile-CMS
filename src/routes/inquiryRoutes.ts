import express from "express";
import {
  createInquiry,
  getInquiries,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(createInquiry).get(protect, getInquiries);

router.route("/:id").delete(protect, deleteInquiry);

export default router;
