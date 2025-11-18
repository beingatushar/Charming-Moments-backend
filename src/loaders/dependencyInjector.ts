import { ProductController } from "../controllers/productController";
import { ProductRepository } from "../repositories/productRepository";
import { ProductService } from "../services/productService";

import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";

// Product Injection
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// User Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export {
  productController,
  productRepository,
  productService,
  userController,
  userRepository,
  userService,
};
