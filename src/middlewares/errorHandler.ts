import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import { config } from "../config";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error as ApiError;

  logger.error(message, { stack: error.stack });

  const response = {
    success: false,
    message,
    ...(config.nodeEnv === "development" && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
