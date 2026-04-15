import express from "express";
import multer from "multer";
import path from "path";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const careerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/resumes/");
  },
  filename(req, file, cb) {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function resumeFilter(file: any, cb: any) {
  const filetypes = /pdf|doc|docx/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype =
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX allowed"));
  }
}

const uploadResume = multer({
  storage: careerStorage,
  fileFilter: (req, file, cb) => resumeFilter(file, cb),
});

// File filter (only images)
function checkFileTypes(file: any, cb: any) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb);
  },
});

// @desc    Upload image
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  (req: any, res: any) => {
    res.send(`/${req.file.path.replace(/\\/g, "/")}`);
  },
);
router.post("/unauth", upload.single("image"), (req: any, res: any) => {
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

router.post("/career", uploadResume.single("file"), (req: any, res: any) => {
  res.json({
    url: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
