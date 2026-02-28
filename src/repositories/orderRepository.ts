import { IOrderRepository } from "../interfaces/IOrderRepository";
import Order, { IOrder } from "../models/orderModel";

export class OrderRepository implements IOrderRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    return order.save();
  }

  async findById(id: string): Promise<IOrder | null> {
    return Order.findOne({ id }).exec();
  }

  async findByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(query: any, skip: number, limit: number): Promise<IOrder[]> {
    return Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(
    id: string,
    updateData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    return Order.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<IOrder | null> {
    return Order.findOneAndDelete({ id }).exec();
  }
}
