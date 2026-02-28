import express from "express";
import { orderController } from "../../loaders/dependencyInjector";
import { requireAdmin, requireAuth } from "../../middlewares/auth";
import { catchAsync } from "../../utils/catchAsync";

const router = express.Router();

// Apply auth middleware to all order routes
router.use(requireAuth);

router.post("/", catchAsync(orderController.createOrder));
router.get("/my-orders", catchAsync(orderController.getMyOrders));
router.get("/:id", catchAsync(orderController.getOrderById));
router.patch("/:id/cancel", catchAsync(orderController.cancelOrder));

// Admin routes
router.get("/", requireAdmin, catchAsync(orderController.getAllOrders));
router.patch(
  "/:id/status",
  requireAdmin,
  catchAsync(orderController.updateOrderStatus),
);

export default router;
