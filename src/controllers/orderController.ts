import { Request, Response } from "express";
import { z } from "zod";
import { IOrderService } from "../interfaces/IOrderService";
import { ApiResponse } from "../utils/ApiResponse";

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Order must contain at least one item"),
  shippingAddress: addressSchema,
  paymentMethod: z.string().min(1),
});

export class OrderController {
  constructor(private orderService: IOrderService) {}

  createOrder = async (req: Request, res: Response) => {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = (req as any).user.id; // Expected from auth middleware
    const order = await this.orderService.createOrder(userId, validatedData);
    new ApiResponse(201, order, "Order placed successfully").send(res);
  };

  getMyOrders = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const orders = await this.orderService.getUserOrders(userId);
    new ApiResponse(200, orders, "Orders retrieved successfully").send(res);
  };

  getOrderById = async (req: Request, res: Response) => {
    const { id, role } = (req as any).user;
    const order = await this.orderService.getOrderById(req.params.id, id, role);
    new ApiResponse(200, order, "Order retrieved successfully").send(res);
  };

  getAllOrders = async (req: Request, res: Response) => {
    const orders = await this.orderService.getAllOrders(req.query);
    new ApiResponse(200, orders, "All orders retrieved successfully").send(res);
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    const { status } = z.object({ status: z.string() }).parse(req.body);
    const order = await this.orderService.updateOrderStatus(
      req.params.id,
      status,
    );
    new ApiResponse(200, order, "Order status updated").send(res);
  };

  cancelOrder = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const order = await this.orderService.cancelOrder(req.params.id, userId);
    new ApiResponse(200, order, "Order cancelled successfully").send(res);
  };
}
