import { IBanner } from "../models/bannerModel";

export interface IBannerService {
  getBanner(): Promise<IBanner>;
  updateBanner(text: string): Promise<IBanner>;
}
