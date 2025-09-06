import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/productService";
import { IProduct } from "../models/productModel";
import logger from "../utils/logger"; // Assuming you've created a logger utility
import { z } from "zod";

// Instantiate the service
const productService = new ProductService();

// --- Input Validation Schemas ---

const productSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  size: z.string().trim().optional(),
  price: z.number().positive("Price must be a positive number"),
  features: z.array(z.string()).optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5").optional(),
  tags: z.array(z.string()).optional(),
  material: z.string().trim().optional(),
});

const bulkProductSchema = z.array(productSchema);

const updateProductSchema = productSchema.partial(); // All fields are optional for updates

// --- Controller Functions ---

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info("Controller: Fetching all products", { query: req.query });
    const products = await productService.getAllProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    logger.error("Controller: Error fetching all products", { error });
    next(error); // Pass to centralized error handler
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info("Controller: Fetching all categories");
    const categories = await productService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    logger.error("Controller: Error fetching categories", { error });
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    logger.info(`Controller: Fetching product by ID: ${id}`);
    const product = await productService.getProductById(id);

    if (!product) {
      logger.warn(`Controller: Product not found with ID: ${id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Controller: Error fetching product by ID: ${req.params.id}`, {
      error,
    });
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = productSchema.parse(req.body);
    logger.info("Controller: Creating new product", {
      productData: validatedData,
    });

    const newProduct = await productService.createProduct(
      validatedData as IProduct,
    );
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Controller: Validation failed for creating product", {
        errors: error,
      });
      res
        .status(400)
        .json({ message: "Invalid input", errors: error.flatten() });
    } else {
      logger.error("Controller: Error creating product", { error });
      next(error);
    }
  }
};

export const createBulkProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = bulkProductSchema.parse(req.body);
    logger.info(`Controller: Creating ${validatedData.length} bulk products`);

    const newProducts = await productService.createBulkProducts(
      validatedData as IProduct[],
    );
    res.status(201).json(newProducts);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Controller: Validation failed for bulk creating products", {
        errors: error,
      });
      res
        .status(400)
        .json({ message: "Invalid input", errors: error.flatten() });
    } else {
      logger.error("Controller: Error creating bulk products", { error });
      next(error);
    }
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);
    logger.info(`Controller: Updating product with ID: ${id}`, {
      updateData: validatedData,
    });

    if (Object.keys(validatedData).length === 0) {
      res.status(400).json({ message: "No update data provided." });
      return;
    }

    const updatedProduct = await productService.updateProduct(
      id,
      validatedData,
    );

    if (!updatedProduct) {
      logger.warn(`Controller: Product not found for update with ID: ${id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        `Controller: Validation failed for updating product ID: ${req.params.id}`,
        { errors: error },
      );
      res
        .status(400)
        .json({ message: "Invalid input", errors: error.flatten() });
    } else {
      logger.error(`Controller: Error updating product ID: ${req.params.id}`, {
        error,
      });
      next(error);
    }
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    logger.info(`Controller: Deleting product with ID: ${id}`);
    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      logger.warn(`Controller: Product not found for deletion with ID: ${id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(`Controller: Error deleting product ID: ${req.params.id}`, {
      error,
    });
    next(error);
  }
};
