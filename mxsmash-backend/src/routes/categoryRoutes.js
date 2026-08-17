import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, isAdmin, createCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;