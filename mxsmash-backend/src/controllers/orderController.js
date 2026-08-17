import prisma from "../config/prisma.js";
import generateOrderNumber from "../utils/generateOrderNumber.js";

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }
    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: "Delivery address and phone are required" });
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      const productAddOns = product.addOns || [];
      const selectedAddOns = productAddOns.filter((addon) =>
        (item.selectedAddOnIds || []).includes(addon.id)
      );
      const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = product.price + addOnsTotal;
      totalAmount += unitPrice * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: unitPrice,
        selectedAddOns,
      };
    });

    // Generate a unique order number, retrying if a collision happens (very unlikely, but safe)
    let orderNumber;
    let isUnique = false;
    while (!isUnique) {
      orderNumber = generateOrderNumber();
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (!existing) isUnique = true;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.userId,
        totalAmount,
        deliveryAddress,
        phone,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// GET logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single order by id (owner or admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC - look up an order by tracking number + phone (no login required)
export const trackOrder = async (req, res) => {
  try {
    const { orderNumber, phone } = req.body;

    if (!orderNumber || !phone) {
      return res.status(400).json({ message: "Order number and phone are required" });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: { items: { include: { product: true } } },
    });

    // Match both fields so strangers can't look up orders with just the short code
    if (!order || order.phone !== phone.trim()) {
      return res.status(404).json({ message: "Order not found. Check your order number and phone." });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};