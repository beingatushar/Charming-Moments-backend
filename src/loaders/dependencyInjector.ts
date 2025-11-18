import { ProductController } from "../controllers/productController";
import { ProductRepository } from "../repositories/productRepository";
import { ProductService } from "../services/productService";

import { BannerController } from "../controllers/bannerController";
import { UserController } from "../controllers/userController";
import { BannerRepository } from "../repositories/bannerRepository";
import { UserRepository } from "../repositories/userRepository";
import { BannerService } from "../services/bannerService";
import { UserService } from "../services/userService";

// Product Injection
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// User Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const bannerRepository = new BannerRepository();
const bannerService = new BannerService(bannerRepository);
const bannerController = new BannerController(bannerService);
export {
  bannerController,
  bannerRepository,
  bannerService,
  productController,
  productRepository,
  productService,
  userController,
  userRepository,
  userService,
};
