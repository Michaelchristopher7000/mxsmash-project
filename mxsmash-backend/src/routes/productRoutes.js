import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts); // must come BEFORE /:id or it'll be treated as an id
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;