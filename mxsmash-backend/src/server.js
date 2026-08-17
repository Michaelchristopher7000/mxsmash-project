import dotenv from "dotenv";
dotenv.config(); // <--- MOVED TO THE VERY TOP to prevent crashes from undefined env vars

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

//  ADDED HERE: Tells Express to trust proxy headers so the real user IP is captured.
// This is crucial for fetching the correct location of your logged-in users.
app.set("trust proxy", true); 

app.get("/", (req, res) => {
  res.send("Mxsmash Burger API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});