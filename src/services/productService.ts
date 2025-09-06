import { IProduct } from "../models/productModel";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";
import logger from "../utils/logger";

// --- Query Strategy ---
interface IProductQueryStrategy {
  buildQuery(queryParams: any): { query: any; sortOption: any };
}

class DefaultProductQueryStrategy implements IProductQueryStrategy {
  buildQuery(queryParams: any) {
    const { category, sortBy } = queryParams;
    const query: any = { isDeleted: false };

    // FIX: Correctly handle a JSON stringified array or a comma-separated string
    if (category) {
      try {
        // First, try to parse it as a JSON array
        const categories = JSON.parse(category);
        if (Array.isArray(categories) && categories.length > 0) {
          query.category = { $in: categories };
        }
      } catch (error) {
        // If parsing fails, fall back to treating it as a comma-separated string
        logger.warn(
          "Failed to parse category JSON, falling back to comma-separated string.",
          { category },
        );
        query.category = { $in: category.split(",") };
      }
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    return { query, sortOption };
  }
}

// You can add more strategies here, e.g., for different user roles or complex filtering.

export class ProductService implements IProductService {
  private productRepository: IProductRepository;
  private queryStrategy: IProductQueryStrategy;

  constructor(
    productRepository: IProductRepository,
    queryStrategy: IProductQueryStrategy = new DefaultProductQueryStrategy(),
  ) {
    this.productRepository = productRepository;
    this.queryStrategy = queryStrategy;
  }

  async getAllProducts(queryParams: any): Promise<IProduct[]> {
    const { limit = 10, page = 1 } = queryParams;
    const { query, sortOption } = this.queryStrategy.buildQuery(queryParams);
    const skip = (page - 1) * limit;

    return this.productRepository.findAll(query, sortOption, skip, limit);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(productData: IProduct): Promise<IProduct> {
    // Business logic can go here
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
