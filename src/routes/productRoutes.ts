import express from "express";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  cleanProducts,
  getAllCategories,
  getAllProducts,
} from "../controllers/productController";

const router = express.Router();

router.get("/clean", cleanProducts);
router.get("/category", getAllCategories);
// router.get("/category",getAllProductsByCategory)
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
