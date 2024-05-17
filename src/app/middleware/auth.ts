import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { getSession } from "../utils/session.js";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token",
            httpStatusCode: 401,
            error: "VALIDATION_ERROR",
            service: process.env.SERVICE_NAME as string,
          });
        } else {
          // Set the decoded token payload on the request object
          req.user = decoded;

          // Fetch the session using the decoded user ID
          const session = await getSession(decoded.id);

          if (!session) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              success: false,
              message: "Please login again.",
              httpStatusCode: 401,
              error: "VALIDATION_ERROR",
              service: process.env.SERVICE_NAME as string,
            });
          }

          // Set the session on the request object
          req.user = session;

          // Call the next middleware or route handler
          next();
        }
      }
    );
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authorization header is missing or invalid",
      httpStatusCode: 401,
      error: "VALIDATION_ERROR",
      service: process.env.SERVICE_NAME as string,
    });
  }
};
