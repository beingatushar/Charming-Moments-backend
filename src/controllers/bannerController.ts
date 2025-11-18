import { Request, Response } from "express";
import { z } from "zod";
import { IBannerService } from "../interfaces/IBannerService";
import { ApiResponse } from "../utils/ApiResponse";

const bannerSchema = z.object({
  text: z.string().min(1, "Banner text cannot be empty"),
});

export class BannerController {
  private bannerService: IBannerService;

  constructor(bannerService: IBannerService) {
    this.bannerService = bannerService;
  }

  getBanner = async (req: Request, res: Response) => {
    const banner = await this.bannerService.getBanner();
    new ApiResponse(200, banner, "Banner retrieved successfully").send(res);
  };

  updateBanner = async (req: Request, res: Response) => {
    const { text } = bannerSchema.parse(req.body);
    const banner = await this.bannerService.updateBanner(text);
    new ApiResponse(200, banner, "Banner updated successfully").send(res);
  };
}
