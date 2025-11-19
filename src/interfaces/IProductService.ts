import { IProduct } from "../models/productModel";

export interface IProductService {
  getAllProducts(queryParams: any): Promise<IProduct[]>;
  getProductById(id: string): Promise<IProduct | null>;
  createProduct(productData: IProduct): Promise<IProduct>;
  updateProduct(
    id: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<IProduct | null>;
  getAllCategories(): Promise<string[]>;
  getFeaturedProducts(): Promise<IProduct[]>;
  createBulkProducts(products: IProduct[]): Promise<IProduct[]>;
}
