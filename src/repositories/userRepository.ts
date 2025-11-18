import { IUserRepository } from "../interfaces/IUserRepository";
import User, { IUser } from "../models/userModel";

export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    // Explicitly select password for login verification steps
    return User.findOne({ email }).select("+password").exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findOne({ id }).exec();
  }
}
