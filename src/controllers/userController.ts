import { Request, Response } from "express";
import { z } from "zod";
import { IUserService } from "../interfaces/IUserService";
import { ApiResponse } from "../utils/ApiResponse";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  signup = async (req: Request, res: Response) => {
    const validatedData = signupSchema.parse(req.body);
    const result = await this.userService.signup(validatedData);
    new ApiResponse(201, result, "User registered successfully").send(res);
  };

  login = async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await this.userService.login(
      validatedData.email,
      validatedData.password,
    );
    new ApiResponse(200, result, "Login successful").send(res);
  };
}
