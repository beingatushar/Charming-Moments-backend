import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IOrder } from "../models/orderModel";
import { ApiError } from "../utils/ApiError";

export class OrderService implements IOrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
  ) {}

  async createOrder(userId: string, orderData: any): Promise<IOrder> {
    let totalAmount = 0;
    const processedItems = [];

    // Security check: NEVER trust client prices. Calculate on server.
    for (const item of orderData.items) {
      const product = await this.productRepository.findById(item.product);
      if (!product)
        throw new ApiError(404, `Product ${item.product} not found`);

      if (product.stock !== undefined && product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price, // Lock in the price at checkout
      });

      // Deduct stock
      if (product.stock !== undefined) {
        await this.productRepository.update(product.id, {
          stock: product.stock - item.quantity,
        });
      }
    }

    const newOrderData = {
      user: userId,
      items: processedItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      totalAmount,
      status: "Pending" as const,
    };

    return this.orderRepository.create(newOrderData);
  }

  async getOrderById(
    id: string,
    userId: string,
    role: string,
  ): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    // Authorization: users can only view their own orders unless they are an admin
    if (order.user !== userId && role !== "admin") {
      throw new ApiError(403, "You do not have permission to view this order");
    }
    return order;
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async getAllOrders(queryParams: any): Promise<IOrder[]> {
    const { status, limit = 10, page = 1 } = queryParams;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    return this.orderRepository.findAll(query, skip, limit);
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    const order = await this.orderRepository.update(id, { status } as any);
    if (!order) throw new ApiError(404, "Order not found");
    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.user !== userId)
      throw new ApiError(403, "Not authorized to cancel this order");
    if (order.status !== "Pending" && order.status !== "Processing") {
      throw new ApiError(400, "Cannot cancel order at this stage");
    }

    // Restore stock
    for (const item of order.items) {
      const product = await this.productRepository.findById(item.product);
      if (product && product.stock !== undefined) {
        await this.productRepository.update(product.id, {
          stock: product.stock + item.quantity,
        });
      }
    }

    return this.orderRepository.update(id, { status: "Cancelled" } as any);
  }
}
