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
      // Return a default mock object if DB is empty, or create one
      return this.bannerRepository.updateBanner(
        "⚡ Big Sale! 20% Off All Proteins | 💪 Free Shipping over ₹999",
      );
    }
    return banner;
  }

  async updateBanner(text: string): Promise<IBanner> {
    return this.bannerRepository.updateBanner(text);
  }
}
