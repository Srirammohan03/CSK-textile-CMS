import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import customizeRoutes from "./routes/customize.route.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:8080", "https://csk-textiles-yq5o.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/customize", customizeRoutes);

// Static files for images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Basic Health Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CMS API is running" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
