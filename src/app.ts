import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import productRoutes from "./api/routes/productRoutes";
import { connectDB } from "./utils/db";
import morgan from "morgan";

const app = express();

// Enhanced logging
app.use(morgan("combined"));

// Manual CORS middleware with explicit void return type
app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(
    `Incoming ${req.method} request to ${req.path} from origin ${req.headers.origin}`,
  );

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight");
    res.status(200).end();
    return; // Explicit return without value
  }

  next();
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test endpoint
app.get("/api/health", (req: Request, res: Response) => {
  console.log("Health check called");
  res.json({ status: "healthy", cors: "enabled" });
});

// Your routes
app.use("/api/products", productRoutes);

// Error handling with logging
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Connect to DB
connectDB();

export default app;
