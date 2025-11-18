import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";
import { IUser } from "../models/userModel";
import { ApiError } from "../utils/ApiError";

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: "7d" },
    );
  }

  async signup(
    userData: Partial<IUser>,
  ): Promise<{ user: IUser; token: string }> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const newUser = await this.userRepository.create(userData);
    const token = this.generateToken(newUser);

    return { user: newUser, token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Convert to object to strip password via the transform defined in Model
    const userObject = user.toObject() as IUser;
    const token = this.generateToken(user);

    return { user: userObject, token };
  }
}
