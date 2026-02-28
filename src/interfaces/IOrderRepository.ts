import { IOrder } from "../models/orderModel";

export interface IOrderRepository {
  create(orderData: Partial<IOrder>): Promise<IOrder>;
  findById(id: string): Promise<IOrder | null>;
  findByUserId(userId: string): Promise<IOrder[]>;
  findAll(query: any, skip: number, limit: number): Promise<IOrder[]>;
  update(id: string, updateData: Partial<IOrder>): Promise<IOrder | null>;
  delete(id: string): Promise<IOrder | null>;
}
