import express from "express";
import { productController } from "../../loaders/dependencyInjector";
import { catchAsync } from "../../utils/catchAsync";

const router = express.Router();

router.post("/bulk", catchAsync(productController.createBulkProducts));
router.get("/categories", catchAsync(productController.getAllCategories));

router
  .route("/")
  .get(catchAsync(productController.getAllProducts))
  .post(catchAsync(productController.createProduct));

router
  .route("/:id")
  .get(catchAsync(productController.getProductById))
  .put(catchAsync(productController.updateProduct))
  .delete(catchAsync(productController.deleteProduct));

export default router;
