import { IProduct } from "../models/productModel";

export interface IProductRepository {
  findAll(
    query: any,
    sortOption: any,
    skip: number,
    limit: number,
  ): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  create(productData: Partial<IProduct>): Promise<IProduct>;
  update(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
  findDistinctCategories(): Promise<string[]>;
  createBulk(products: IProduct[]): Promise<IProduct[]>;
}
