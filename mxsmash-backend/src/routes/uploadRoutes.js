import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage, uploadAvatar } from "../controllers/uploadController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", protect, isAdmin, upload.single("image"), uploadImage);
router.post("/avatar", protect, upload.single("image"), uploadAvatar);

export default router;