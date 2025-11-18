import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
}

export const connectDB = () => {
  Database.getInstance();
};

// New helper to check connection status
// 1 = connected
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
