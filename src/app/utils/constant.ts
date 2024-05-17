import dotenv from "dotenv";
dotenv.config();
import { Redis } from "./helper.js";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const redisUrl = process.env.REDIS_URL as string;
export const redis = new Redis(redisUrl);

if (process.env.NODE_ENV === "development") {
  console.log("Redis", "Connection estalblished to Redis instance ...");
}

export interface DefaultResponseInt {
  success: boolean;
  data?: Array<any> | Record<string, any> | any;
  message: string;
  error?: any;
  httpStatusCode?: number;
  service?: string;
}

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const encodeJwt = ({
  data,
  secretKey = process.env.APP_KEY || "",
  duration = "24h",
}: {
  data: any;
  secretKey: string;
  duration: string;
}): Promise<any> => {
  return new Promise((ful, rej) => {
    if (!secretKey) return rej(new Error("Kindly supply secret key"));
    jwt.sign(data, secretKey, { expiresIn: duration }, (err, token) => {
      if (err) rej(err);
      ful(token);
    });
  });
};

export function parseJSON(value: any): any {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

export default {
  ACCOUNT_TYPES: {
    USER: "user",
    ADMIN: "admin",
  },
};
