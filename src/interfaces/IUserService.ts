import { IUser } from "../models/userModel";

export interface IUserService {
  signup(userData: Partial<IUser>): Promise<{ user: IUser; token: string }>;
  login(
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }>;
}
