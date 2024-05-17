import { generateOTP, getOtpExpiryTime } from "../../utils/util.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/error.js";
import User from "./model.js";
import { UserDataType } from "./type.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../utils/mailtrap.js";
import { emailTemplate } from "../../template/verifyemail.js";
import { createSession, deleteSession } from "../../utils/session.js";
import { DefaultResponseInt } from "../../utils/constant.js";
import { format } from "date-fns";

export const create = async (payload: UserDataType) => {
  const existingUser = await User.findOne({
    $or: [{ phoneNumber: payload.phoneNumber }, { email: payload.email }],
  });

  if (existingUser) {
    if (existingUser.phoneNumber === payload.phoneNumber) {
      throw new ConflictError(`Phone number already in use`);
    }
    if (existingUser.email === payload.email) {
      throw new ConflictError(`Email already in use`);
    }
  }

  const otp = generateOTP();
  const expired_at = getOtpExpiryTime();
  const hashedOtp = await bcrypt.hash(otp, 10);

  console.log(otp);

  payload.otp = hashedOtp;
  payload.expired_at = expired_at;

  const user = await User.create({ ...payload });

  //send otp to mail
  const mailSubject = "Email Verification";

  const mailBodyType = emailTemplate.replace("{{token}}", otp);

  await sendEmail(user.email, mailSubject, mailBodyType);

  const data = user.toJSON();

  return {
    success: true,
    message: "Please Check your Email To Verify it!",
    data,
  };
};

export const logout = async (id: string) => {
  await deleteSession(id);

  return {
    status: true,
    message: "User successfully logged out",
    data: {},
  };
};

export const loginService = async (
  email: string,
  password: string
): Promise<DefaultResponseInt> => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new BadRequestError("Incorrect login details");
  }

  if (!(await user.comparePassword(password))) {
    throw new UnauthorizedError("Incorrect login details");
  }

  if (!user.verifiedEmail)
    throw new UnauthorizedError("Please verify your email");

  const token = await user.generateJWT();

  const sessionPayload = {
    id: user.id,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  const data = {
    ...user.toJSON(),
    token,
  };

  await createSession(user.id, sessionPayload);

  //Update last login
  const formattedLastLogin = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  await User.findOneAndUpdate(
    { _id: user.id },
    { $set: { lastLogin: formattedLastLogin } }
  );

  return {
    success: true,
    message: `Welcome ${user.email}`,
    data,
  };
};
//Verify email
export const verifyEmailService = async (email: string, otp: string) => {
  const user = await User.findOne({ email: email });

  if (!user) throw new NotFoundError(`User with ${email}: not found`);

  if (user.otp === undefined) {
    throw new BadRequestError(`No OTP found for the user`);
  }

  const isOtpValid = await bcrypt.compare(otp, user.otp);

  if (!isOtpValid) {
    throw new BadRequestError(`Invalid OTP`);
  }

  const otpExpiryDuration = getOtpExpiryTime();

  if (Date.now() > otpExpiryDuration.getTime())
    throw new BadRequestError(`Expired OTP`);

  const newUser = await User.findOneAndUpdate(
    { email: email },
    {
      otp: null,
      expired_at: null,
      verifiedEmail: true,
    }
  );

  const token = await user.generateJWT();

  const sessionPayload = {
    id: user.id,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  await createSession(user.id, sessionPayload);

  return {
    success: true,
    data: [newUser, token],
    message: "Email Verified successful",
  };
};

//Send otp to user

export const sendOtpToMailService = async (email: string) => {
  const user = await User.findOne({ email: email });

  if (!user) throw new NotFoundError(`User not found`);
  const otp = generateOTP();
  const expired_at = getOtpExpiryTime();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await User.findOneAndUpdate(
    { email: user.email },
    { otp: hashedOtp, expired_at: expired_at }
  );

  //send otp to mail
  const mailSubject = "Forget Password";

  const mailBodyType = emailTemplate.replace("{{token}}", otp);

  await sendEmail(user.email, mailSubject, mailBodyType);

  return {
    success: true,
    message: " Otp sent  successfully!",
    data: [],
  };
};

export const getUserByID = async (userId: string) => {
  const result = await User.findById({
    _id: userId,
  }).select({
    password: 0,
  });
  if (!result)
    throw new NotFoundError(`Profile with ID: ${userId} not on this platform`);
  const data = result;

  return {
    success: true,
    message: " Profile retrived successfully!",
    data,
  };
};

export const getAllUsersService = async () => {
  const results = await User.find({}).select({
    password: 0,
  });

  if (!results || results.length === 0)
    throw new NotFoundError(`Customer Profile not found`);

  return {
    count: results.length,
    success: true,
    message: " Profile retrived successfully!",
    data: results,
  };
};

export const getUserByPhoneNumberService = async (number: string) => {
  const result = await User.findOne({
    number: number,
  });

  const data = result?.toJSON();

  return {
    success: true,
    message: " retrived successfully!",
    data,
  };
};

export const forgetPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError(`User not found`);

  let otp = generateOTP();
  let expired_at = getOtpExpiryTime();
  const hashedOtp = await bcrypt.hash(otp, 10);
  console.log(otp);
  await User.findOneAndUpdate(
    {
      email,
    },
    {
      $set: {
        otp: hashedOtp,
        expired_at: expired_at,
      },
    },
    {
      new: true,
    }
  );

  const mailSubject = "Forget Password";

  const mailBodyType = emailTemplate.replace("{{token}}", otp);

  await sendEmail(user.email, mailSubject, mailBodyType);

  return {
    success: true,
    message: " Otp sent  successfully!",
    data: [],
  };
};
export const resetPasswordService = async (
  email: string,
  password: string,
  otp: string
): Promise<DefaultResponseInt> => {
  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError(`User not found`);

  if (user.otp === undefined) {
    throw new BadRequestError(`No OTP found for this user`);
  }

  const isOtpValid = await bcrypt.compare(otp, user.otp);

  if (!isOtpValid) {
    throw new BadRequestError(`Invalid OTP`);
  }

  const otpExpiryDuration = getOtpExpiryTime();

  if (Date.now() > otpExpiryDuration.getTime())
    throw new BadRequestError(`Expired OTP`);

  const hashedPassword = await bcrypt.hash(password, 16);

  const newUser = await User.findOneAndUpdate(
    {
      email,
    },
    {
      $set: {
        password: hashedPassword,
        otp: null,
        expired_at: null,
      },
    }
  );

  // const data = newUser?.toJSON();
  return {
    success: true,
    message: " Password reset  successfully!",
    data: [],
  };
};
