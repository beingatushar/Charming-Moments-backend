import winston from "winston";

// Determine the log level based on the environment
const level = process.env.NODE_ENV === "production" ? "warn" : "debug";

// Define different formats for development and production
const format =
  process.env.NODE_ENV === "production"
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      );

// Define transports (where the logs should go)
const transports = [
  // Always log to the console
  new winston.transports.Console(),

  // In production, also log to files
  ...(process.env.NODE_ENV === "production"
    ? [
        new winston.transports.File({
          filename: "error.log",
          level: "error",
        }),
        new winston.transports.File({ filename: "combined.log" }),
      ]
    : []),
];

// Create the logger instance
const logger = winston.createLogger({
  level: level,
  format: format,
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
