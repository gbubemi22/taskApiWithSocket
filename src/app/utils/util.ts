import mongoose from 'mongoose';
import { encodeJwt, redis } from './constant.js';
import { v1 as uuidV1, v4 as uuidV4, validate as UUIDValidation } from 'uuid';
import otpGenerator from 'otp-generator';

const connectDB = (url: string) => {
  mongoose.set('strictQuery', false);

  return mongoose.connect(url);
};


export const generateOTP = () => {
  const OTP = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return OTP;
};




const getOtpExpiryTime = () => {
  const expiredAtDate = new Date(new Date().getTime() + 1000 * 60 * 10); // 10 minutes
  return expiredAtDate;
};

const generateToken = async (userData: any) => {
  const sessionId = `SESSION_ID::${uuidV4()}`;

  const token = await encodeJwt({
    data: { sessionId },
    duration: process.env.JWT_TOKEN_VALIDITY as string,
    secretKey: process.env.APP_KEY as string,
  });

  const promises = [redis.set(sessionId, userData)];

  if (userData?.sessionId) promises.push(redis.delete(userData?.sessionId));

  await Promise.all(promises);

  return [token, sessionId];

  //   const cacheKey = `${userData._id}::TOKEN`;

  //   const token = jwt.sign({ ...userData }, configs.JWT_SECRET || '', {
  //     expiresIn: configs.JWT_LIFETIME || '50d',
  //   });

  //   await redisClient.set(cacheKey, token, 'EX', 10);

  //   return token;
};



export type VerifyEmailDataType = {
  token: string;
  subject: string;
  name: string;
};

export type OtpDataType = {
  otp: string;
  name: string;
  subject: string;
};



export type PrepareMailDataType = {
  mailRecipients: string[] | string;
  mailSubject?: string;
  mailBody: string;
  senderName: string;
  senderEmail: string;
};

export type SendMailDataType = {
  senderName: string;
  senderEmail: string;
  mailRecipients: string[] | string;
  mailSubject?: string;
  mailBody: string;
  mailAttachments?: string;
};

// export const sendSMS = async (phoneNumber: string, token: string) => {
//   try {
//     const message = `Hello, your Insurance authentication code is ${token}. Expires in 10 minutes. PLEASE DO NOT SHARE.`;
//     const fullPhoneNumber = `234${phoneNumber.slice(1)}`;
//     const data = {
//       to: fullPhoneNumber,
//       sms: message,
//       channel: 'generic',
//       type: 'plain',
//       from: process.env.TERMII_SENDER_ID,
//       api_key: process.env.TERMII_API_KEY as string,
//     };

//     // Send the SMS using the Termii API
//     const response = await axios.post(
//       'https://api.ng.termii.com/api/sms/send',
//       data,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('SMS sent successfully:', response.data);
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw new Error('Error sending SMS');
//   }
// };

// export const sendSMS1 = async (phoneNumber: string, message: any) => {
//   const fullPhoneNumber = `234${phoneNumber.slice(1)}`;

//   const url = 'https://api.sendchamp.com/api/v1/sms/send';
//   const headers = {
//     Accept: 'application/json,text/plain,*/*',
//     'Content-Type': 'application/json',
//     Authorization:
//       'Bearer sendchamp_live_$2a$10$rZKsZeYMKCEtjB203tI.zeLgW1M1B2EZvM3NLdJ6mOebED0zYvy5y',
//   };
//   const data = {
//     to: fullPhoneNumber,
//     message,
//     sender_name: 'SAlert',
//     route: 'dnd',
//   };

//   try {
//     const response = await axios.post(url, data, { headers });
//     console.log('SMS sent successfully:', response.data);
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//   }
// };

export {
  generateToken,
  
  getOtpExpiryTime,
  //KakaConfig,
  connectDB,
  
};
