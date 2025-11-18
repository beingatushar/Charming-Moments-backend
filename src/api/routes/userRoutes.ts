import express from "express";
import { userController } from "../../loaders/dependencyInjector";
import { catchAsync } from "../../utils/catchAsync";

const router = express.Router();

// POST /api/user/signup
router.post("/signup", catchAsync(userController.signup));

// POST /api/user/login
router.post("/login", catchAsync(userController.login));

export default router;
