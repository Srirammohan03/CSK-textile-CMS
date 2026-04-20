import express from "express";
import {
  getJobs,
  getJobsAdmin,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplications,
  getAllApplications,
} from "../controllers/jobController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, getJobsAdmin);
router.get("/applications", protect, getAllApplications);

router.route("/").get(getJobs).post(protect, createJob);

router.post("/apply", applyToJob);

router
  .route("/:id")
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.get("/:id/applications", protect, getApplications);

export default router;
