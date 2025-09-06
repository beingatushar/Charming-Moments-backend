import { Response } from "express";

export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;

  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  send(res: Response): void {
    res.status(this.statusCode).json({
      success: true,
      message: this.message,
      data: this.data,
    });
  }
}
