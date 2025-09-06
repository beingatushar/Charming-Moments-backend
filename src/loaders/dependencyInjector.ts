import { ProductRepository } from "../repositories/productRepository";
import { ProductService } from "../services/productService";
import { ProductController } from "../controllers/productController";

// Create instances by injecting dependencies
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export { productController, productService, productRepository };
