import { IBannerRepository } from "../interfaces/IBannerRepository";
import { IBannerService } from "../interfaces/IBannerService";
import { IBanner } from "../models/bannerModel";

export class BannerService implements IBannerService {
  private bannerRepository: IBannerRepository;

  constructor(bannerRepository: IBannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async getBanner(): Promise<IBanner> {
    const banner = await this.bannerRepository.getBanner();
    if (!banner) {
      // 🔹 FIX: Default content using 'content' and '|||' delimiter
      return this.bannerRepository.updateBanner(
        "Welcome to Shelly Nutrition!|||Free Shipping on orders over ₹999",
      );
    }
    return banner;
  }

  async updateBanner(content: string): Promise<IBanner> {
    return this.bannerRepository.updateBanner(content);
  }
}
