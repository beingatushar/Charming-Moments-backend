import { IBanner } from "../models/bannerModel";

export interface IBannerRepository {
  getBanner(): Promise<IBanner | null>;
  updateBanner(text: string): Promise<IBanner>;
}
