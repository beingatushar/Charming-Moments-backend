import express from "express";
import { bannerController } from "../../loaders/dependencyInjector";
import { catchAsync } from "../../utils/catchAsync";

const router = express.Router();

router.get("/", catchAsync(bannerController.getBanner));
router.post("/", catchAsync(bannerController.updateBanner)); // In a real app, add auth middleware here

export default router;
