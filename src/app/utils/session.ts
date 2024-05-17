import { Types } from "mongoose";
import { redis } from "./constant.js";
import { BadRequestError } from "./error.js";
import { Redis } from "./helper.js";

export declare type DefaultResponseInterface = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
  HttpStatusCode?: number;
  
};

export type DecodedUser = {
  id: Types.ObjectId;
  email: string;
  phoneNumber: string;
};





export const createSession = async (
      id: string,
      payload: DecodedUser
    ) => {
      const key = `auth:sessions:${id}`;
    
      try {
        const redisInstance = new Redis(redis as unknown as string);
    
        // Retrieve current session if it exists
        const currentSession = await redisInstance.get(key);
    
        // If a session exists, delete it
        if (currentSession) {
          await redisInstance.delete(key);
        }
    
        // Set the new session with a duration of 30 minutes (60 seconds * 30)
        const duration = 60 * 30;
    
        const durationFor7Days = duration * 24 * 7;
    
        // Duration for 1000 days (in minutes)
        const durationFor1000Days = duration * 24 * 1000;
    
        await redisInstance.setEx(key, payload, durationFor1000Days);
    
        return id;
      } catch (error) {
        console.error("Error creating session:", (error as Error).message);
        throw new BadRequestError(`Error creating session`);
      }
    };
    
    export const getSession = async (insuredId: string) => {
      const key = `auth:sessions:${insuredId}`;
    
      const redisInstance = new Redis(redis as unknown as string);
    
      // Retrieve current session if it exists
      const session = await redisInstance.get(key);
    
      if (!session || session === "") return false;
    
      return session;
    };
    
    export const deleteSession = async (insuredId: string) => {
      const key = `auth:sessions:${insuredId}`;
      const redisInstance = new Redis(redis as unknown as string);
    
      await redisInstance.delete(key);
    
      return true;
    };