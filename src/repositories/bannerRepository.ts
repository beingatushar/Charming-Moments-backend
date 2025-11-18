import { IBannerRepository } from "../interfaces/IBannerRepository";
import Banner, { IBanner } from "../models/bannerModel";

export class BannerRepository implements IBannerRepository {
  async getBanner(): Promise<IBanner | null> {
    return Banner.findOne().exec();
  }

  async updateBanner(text: string): Promise<IBanner> {
    // Upsert: Update if exists, create if not
    const banner = await Banner.findOneAndUpdate(
      {},
      { text },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
    return banner;
  }
}
