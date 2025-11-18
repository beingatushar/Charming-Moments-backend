import { Request, Response } from "express";
import { z } from "zod";
import { IProductService } from "../interfaces/IProductService";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Schemas remain the same...
const productSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  name: z.string().trim().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().optional(), // <--- This is the critical fix
  description: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  material: z.string().optional(),
  size: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});
const updateProductSchema = productSchema.partial();
const bulkProductSchema = z.array(productSchema);

export class ProductController {
  private productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  getAllProducts = async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts(req.query);
    console.log(req.query);
    new ApiResponse(200, products, "Products retrieved successfully").send(res);
  };

  getProductById = async (req: Request, res: Response) => {
    const product = await this.productService.getProductById(req.params.id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    new ApiResponse(200, product, "Product retrieved successfully").send(res);
  };

  createProduct = async (req: Request, res: Response) => {
    const validatedData = productSchema.parse(req.body);
    const newProduct = await this.productService.createProduct(
      validatedData as any,
    );
    new ApiResponse(201, newProduct, "Product created successfully").send(res);
  };

  updateProduct = async (req: Request, res: Response) => {
    const validatedData = updateProductSchema.parse(req.body);
    const updatedProduct = await this.productService.updateProduct(
      req.params.id,
      validatedData,
    );
    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }
    new ApiResponse(200, updatedProduct, "Product updated successfully").send(
      res,
    );
  };

  deleteProduct = async (req: Request, res: Response) => {
    const deletedProduct = await this.productService.deleteProduct(
      req.params.id,
    );
    if (!deletedProduct) {
      throw new ApiError(404, "Product not found");
    }
    new ApiResponse(
      200,
      { id: req.params.id },
      "Product deleted successfully",
    ).send(res);
  };

  getAllCategories = async (req: Request, res: Response) => {
    const categories = await this.productService.getAllCategories();
    new ApiResponse(200, categories, "Categories retrieved successfully").send(
      res,
    );
  };

  createBulkProducts = async (req: Request, res: Response) => {
    const validatedData = bulkProductSchema.parse(req.body);
    const newProducts = await this.productService.createBulkProducts(
      validatedData as any[],
    );
    new ApiResponse(
      201,
      newProducts,
      "Bulk products created successfully",
    ).send(res);
  };
}
