import { Request, Response } from "express";
import Product, { IProduct } from "../models/productModel";
import { randomUUID } from "crypto";
// import logger from '../utils/logger';

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categoryQuery = req.query.category as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    let products;
    let query: any = { isDeleted: false };

    let categories: string[] = [];
    // Handle category filtering if query is present
    if (categoryQuery) {
      try {
        // Try to parse as JSON array first
        const decodedQuery = decodeURIComponent(categoryQuery);
        categories = JSON.parse(decodedQuery) as string[];

        if (!Array.isArray(categories)) {
          throw new Error("Category parameter must be a JSON array");
        }
      } catch (parseError) {
        // Fallback to comma-separated string if JSON parse fails
        categories = categoryQuery.split(",").map((cat) => cat.trim());
      }
      query.category = { $in: categories };
    }

    console.log(
      categoryQuery
        ? `Fetching products for categories: ${categories}`
        : "Fetching all products",
    );

    // Database-level sorting (more efficient)
    let sortOption = {};
    if (sortBy) {
      switch (sortBy) {
        case "price-low-to-high":
          sortOption = { price: 1 };
          break;
        case "price-high-to-low":
          sortOption = { price: -1 };
          break;
        case "date-added-newest":
          sortOption = { dateAdded: -1 };
          break;
        case "date-added-oldest":
          sortOption = { dateAdded: 1 };
          break;
        case "rating-high-to-low":
          sortOption = { rating: -1 };
          break;
        case "name-a-z":
          sortOption = { name: 1 };
          break;
        case "name-z-a":
          sortOption = { name: -1 };
          break;
        default:
          break;
      }
    }

    products = await Product.find(query).sort(sortOption);

    // If we couldn't do the sort at database level (or for complex sorts)
    if (sortBy && Object.keys(sortOption).length === 0) {
      products.sort((a, b) => {
        switch (sortBy) {
          case "price-low-to-high":
            return a.price - b.price;
          case "price-high-to-low":
            return b.price - a.price;
          case "date-added-newest":
            return (
              new Date(b.dateAdded || "").getTime() -
              new Date(a.dateAdded || "").getTime()
            );
          case "date-added-oldest":
            return (
              new Date(a.dateAdded || "").getTime() -
              new Date(b.dateAdded || "").getTime()
            );
          case "rating-high-to-low":
            return (b.rating ?? 0) - (a.rating ?? 0);
          case "name-a-z":
            return a.name.localeCompare(b.name);
          case "name-z-a":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    console.log(`Successfully fetched ${products.length} products`);
    res.status(200).json(products);
  } catch (error) {
    console.error(
      `Error fetching products: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("Starting to fetch all categories");
    const allCategories = await Product.distinct("category", {
      isDeleted: false,
    });
    console.log(`Successfully fetched ${allCategories.length} categories`);
    res.status(200).json(allCategories);
  } catch (error) {
    console.error(
      `Error fetching products: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(`Attempting to fetch product with ID: ${req.params.id}`);
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      console.warn(`Product not found with ID: ${req.params.id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (product.isDeleted) {
      console.warn(`Product is deleted with ID: ${req.params.id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }

    console.log(`Successfully fetched product with ID: ${req.params.id}`);
    res.status(200).json(product);
  } catch (error) {
    console.error(
      `Error fetching product ID ${req.params.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productData: IProduct = req.body;
  console.log("Starting product creation", { productData });

  try {
    // Mongoose will automatically generate the ID from the schema
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    console.log(`Product created successfully with ID: ${savedProduct.id}`);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(
      `Error creating product: ${error instanceof Error ? error.message : "Unknown error"}`,
      { productData },
    );

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`Attempting to update product ID: ${id}`, { updateData });

    const updatedProduct = await Product.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      console.warn(`Product not found for update with ID: ${id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }

    console.log(`Product updated successfully with ID: ${id}`);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(
      `Error updating product ID ${req.params.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete product with ID: ${id}`);
    const product = await Product.findOne({ id });

    if (!product) {
      console.warn(`Product not found for deletion with ID: ${id}`);
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.isDeleted) {
      console.warn(`Product already deleted with ID: ${id}`);
      res.status(400).json({ message: "Product already deleted" });
      return;
    }

    product.isDeleted = true;
    await product.save();

    console.log(`Product deleted successfully with ID: ${id}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(
      `Error deleting product ID ${req.params.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const cleanProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("Starting product cleaning process");
    const products = await Product.find({});
    let updatedCount = 0;

    console.log(`Found ${products.length} products to process`);

    for (const product of products) {
      const updateFields: Partial<IProduct> = {};
      let needsUpdate = false;
      product.id = product._id;
      await product.save();

      console.debug(`Processing product ID: ${product._id}`);

      // Clean string fields
      if (typeof product.category === "string") {
        const cleaned = product.category.trim().replace(/\s+/g, " ");
        if (cleaned !== product.category) {
          updateFields.category = cleaned;
          needsUpdate = true;
        }
      }

      // ... (rest of your field cleaning logic remains the same)

      if (needsUpdate) {
        console.debug(`Updating product ID: ${product._id}`, { updateFields });
        await Product.findByIdAndUpdate(
          product._id,
          { $set: updateFields },
          { new: true },
        );
        updatedCount++;
        console.debug(`Product ID ${product._id} updated successfully`);
      }
    }

    console.log(
      `Product cleaning completed. Updated ${updatedCount}/${products.length} products`,
    );
    res.status(200).json({
      message: "Products cleaned successfully",
      updatedCount,
      totalProducts: products.length,
    });
  } catch (error) {
    console.error(
      `Error during product cleaning: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
