# Charming Moments - Backend API

![Node.js](https://img.shields.io/badge/Node.js-14.x-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)

This is the backend service for the **Charming Moments** application. It's a robust RESTful API built with Node.js, Express, and TypeScript, providing complete CRUD (Create, Read, Update, Delete) functionality for managing products.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)

## ✨ Features

- **Full CRUD Functionality:** Complete support for creating, reading, updating, and deleting products.
- **Bulk Operations:** Endpoints for creating multiple products at once and retrieving all product categories.
- **Advanced Error Handling:** A centralized error handling middleware ensures consistent and informative error responses.
- **Comprehensive Logging:** Utilizes Winston for detailed logging, with distinct formats for development and production environments.
- **Dependency Injection:** Employs a clean dependency injection pattern to separate concerns between controllers, services, and repositories.
- **Schema Validation:** Leverages Zod for strict request body validation to maintain data integrity.
- **Database Integration:** Uses MongoDB with Mongoose for efficient data modeling and persistence.

## 🛠️ Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **Logging:** Winston
- **Environment Variables:** Dotenv
- **Middleware:** CORS, Morgan

## 📂 Project Structure

The project follows a modular and scalable structure to keep the codebase organized and maintainable.

```

/
├── src/
│   ├── api/
│   │   └── routes/
│   │       └── productRoutes.ts   \# Defines API routes for products
│   ├── config/
│   │   └── index.ts               \# Manages environment variables
│   ├── controllers/
│   │   └── productController.ts   \# Handles request and response logic
│   ├── interfaces/                \# Defines TypeScript interfaces
│   ├── loaders/
│   │   └── dependencyInjector.ts  \# Sets up dependency injection
│   ├── middlewares/
│   │   └── errorHandler.ts        \# Global error handling
│   ├── models/
│   │   └── productModel.ts        \# Mongoose data model for products
│   ├── repositories/
│   │   └── productRepository.ts   \# Handles direct database interactions
│   ├── services/
│   │   └── productService.ts      \# Contains the core business logic
│   ├── utils/                     \# Utility functions and classes
│   ├── app.ts                     \# Express application setup
│   └── server.ts                  \# Application entry point
├── .env.example                   \# Example for environment variables
├── nodemon.json                   \# Configuration for Nodemon
├── package.json                   \# Project metadata and dependencies
├── tsconfig.json                  \# TypeScript compiler configuration
└── vercel.json                    \# Vercel deployment configuration

````

## 🚀 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint                 | Description                                    |
| :----- | :----------------------- | :--------------------------------------------- |
| `GET`  | `/health`                | Checks the health status of the API.           |
| `GET`  | `/products`              | Retrieves a list of all products.              |
| `GET`  | `/products/:id`          | Retrieves a single product by its unique ID.   |
| `POST` | `/products`              | Creates a new product.                         |
| `PUT`  | `/products/:id`          | Updates an existing product by its ID.         |
| `DELETE`| `/products/:id`          | Deletes a product by its ID (soft delete).     |
| `GET`  | `/products/categories`   | Retrieves a list of all distinct categories.   |
| `POST` | `/products/bulk`         | Creates multiple products from an array.       |

## 🏁 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or Yarn
- A running MongoDB instance (local or cloud-hosted)

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone [https://github.com/beingatushar/charming-moments-backend.git](https://github.com/beingatushar/charming-moments-backend.git)
    cd charming-moments-backend
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with your specific configuration:
    ```env
    # The port the server will run on
    PORT=3000

    # Your MongoDB connection string
    MONGO_URI=your_mongodb_connection_string_here

    # The application environment
    NODE_ENV=development
    ```

### Running the Application

-   **Development Mode** (with hot-reloading):
    ```bash
    npm run dev
    ```

-   **Production Mode**:
    ```bash
    npm run build
    npm start
    ```

## 📜 Available Scripts

-   `npm run build`: Compiles the TypeScript source code into JavaScript in the `dist/` directory.
-   `npm start`: Runs the compiled application from the `dist/` directory.
-   `npm run dev`: Starts the server in development mode with `nodemon` and `ts-node` for automatic restarts on file changes.
-   `npm run format`: Formats all project files using Prettier to maintain consistent code style.

## 部署 (Deployment)

This project is pre-configured for seamless deployment to **Vercel**. The `vercel.json` file handles the build process and routing. To deploy, connect your GitHub repository to a new Vercel project, and Vercel will handle the rest.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.