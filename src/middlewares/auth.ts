import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded; // Mount user payload onto req
    next();
  } catch (err) {
    next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ((req as any).user?.role !== "admin") {
    return next(new ApiError(403, "Forbidden: Admin access required"));
  }
  next();
};
