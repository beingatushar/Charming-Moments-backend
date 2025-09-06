import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./api/routes/productRoutes";
import { connectDB } from "./utils/db";
import errorHandler from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";

const app = express();

// Middlewares
app.use(morgan("combined"));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Connect to DB
connectDB();

// API Routes
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Handle 404 - Not Found
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// Global Error Handler
app.use(errorHandler);

export default app;
