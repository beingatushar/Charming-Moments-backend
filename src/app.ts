import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./api/routes/productRoutes";
import userRoutes from "./api/routes/userRoutes";
import errorHandler from "./middlewares/errorHandler";
import { ApiError } from "./utils/ApiError";
import { connectDB, isConnected } from "./utils/db"; // Import isConnected
import bannerRoutes from "./api/routes/bannerRoutes";
const app = express();

// Middlewares
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
// Connect to DB
connectDB();

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/banner", bannerRoutes);

// Enhanced Health check
app.get("/api/health", (req, res) => {
  const dbStatus = isConnected();
  const healthInfo = {
    status: dbStatus ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus ? "connected" : "disconnected",
    },
  };

  // Return 503 if any critical service is down, otherwise 200
  res.status(dbStatus ? 200 : 503).json(healthInfo);
});

// Handle 404 - Not Found
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// Global Error Handler
app.use(errorHandler);

export default app;
