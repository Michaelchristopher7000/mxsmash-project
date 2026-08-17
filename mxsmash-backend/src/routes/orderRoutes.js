import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  trackOrder,
} from "../controllers/orderController.js";
import protect from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/track", trackOrder); // public - no auth needed
router.get("/my-orders", protect, getMyOrders);
router.get("/all", protect, isAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;