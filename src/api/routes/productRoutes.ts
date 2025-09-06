import express from "express";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createBulkProducts,
  getAllProducts,
} from "../../controllers/productController"; // Updated import path

const router = express.Router();

// Route for creating multiple products in one go
router.post("/bulk", createBulkProducts);

// Route for getting all unique product categories
router.get("/categories", getAllCategories);

// Routes for all products
router.get("/", getAllProducts);
router.post("/", createProduct);

// Routes for a single product by its ID
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
