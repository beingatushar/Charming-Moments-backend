import { IOrder } from "../models/orderModel";

export interface IOrderService {
  createOrder(userId: string, orderData: any): Promise<IOrder>;
  getOrderById(
    id: string,
    userId: string,
    role: string,
  ): Promise<IOrder | null>;
  getUserOrders(userId: string): Promise<IOrder[]>;
  getAllOrders(queryParams: any): Promise<IOrder[]>;
  updateOrderStatus(id: string, status: string): Promise<IOrder | null>;
  cancelOrder(id: string, userId: string): Promise<IOrder | null>;
}
