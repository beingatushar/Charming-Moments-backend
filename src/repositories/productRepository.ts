import Product, { IProduct } from "../models/productModel";
import { IProductRepository } from "../interfaces/IProductRepository";

export class ProductRepository implements IProductRepository {
  async findAll(
    query: any,
    sortOption: any,
    skip: number,
    limit: number,
  ): Promise<IProduct[]> {
    return Product.find(query).sort(sortOption).skip(skip).limit(limit).exec();
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findOne({ id, isDeleted: false }).exec();
  }

  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(productData);
    return product.save();
  }

  async update(
    id: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    return Product.findOneAndUpdate({ id, isDeleted: false }, updateData, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<IProduct | null> {
    const product = await this.findById(id);
    if (product) {
      product.isDeleted = true;
      return product.save();
    }
    return null;
  }

  async findDistinctCategories(): Promise<string[]> {
    return Product.distinct("category", { isDeleted: false }).exec();
  }

  async createBulk(products: IProduct[]): Promise<IProduct[]> {
    return Product.insertMany(products);
  }
}
