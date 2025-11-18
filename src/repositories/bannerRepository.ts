import { IBannerRepository } from "../interfaces/IBannerRepository";
import Banner, { IBanner } from "../models/bannerModel";

export class BannerRepository implements IBannerRepository {
  async getBanner(): Promise<IBanner | null> {
    return Banner.findOne().exec();
  }

  async updateBanner(content: string): Promise<IBanner> {
    const banner = await Banner.findOneAndUpdate(
      {},
      { content },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    // Force type assertion if needed, though Mongoose usually handles it
    return banner as IBanner;
  }
}
