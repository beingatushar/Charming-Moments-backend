import { ProductRepository } from "../repositories/productRepository";
import { IProduct } from "../models/productModel";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(queryParams: any): Promise<IProduct[]> {
    const { category, sortBy, limit = 10, page = 1 } = queryParams;
    let query: any = { isDeleted: false };
    if (category) {
      query.category = { $in: category.split(",") };
    }

    let sortOption: Record<string, 1 | -1> = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * limit;

    return this.productRepository.findAll(query, sortOption, skip, limit);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(productData: IProduct): Promise<IProduct> {
    // Add any business logic here, e.g., validation, etc.
    return this.productRepository.create(productData);
  }

  async updateProduct(
    id: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    return this.productRepository.update(id, updateData);
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return this.productRepository.delete(id);
  }

  async getAllCategories(): Promise<string[]> {
    return this.productRepository.findDistinctCategories();
  }

  async createBulkProducts(products: IProduct[]): Promise<IProduct[]> {
    return this.productRepository.createBulk(products);
  }
}
