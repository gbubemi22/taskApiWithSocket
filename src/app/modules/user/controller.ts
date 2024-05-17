import { StatusCodes } from "http-status-codes";
import { Controller } from "../../utils/constant.js";
import {
  create,
  forgetPasswordService,
  loginService,
  logout,
  resetPasswordService,
  sendOtpToMailService,
  verifyEmailService,
} from "./service.js";

export const Create: Controller = async (req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json(await create(req.body));
  } catch (error) {
    next(error);
  }
};

export const Login: Controller = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    res.status(StatusCodes.OK).json(await loginService(email, password));
  } catch (error) {
    next(error);
  }
};

export const Logout: Controller = async (req, res, next) => {
  try {
    const id = req.user.id;
    res.status(StatusCodes.OK).json(await logout(id));
  } catch (error) {
    next(error);
  }
};

export const VerifyEmail: Controller = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    res.status(StatusCodes.OK).json(await verifyEmailService(email, otp));
  } catch (error) {
    next(error);
  }
};

export const SendOtpToEmail: Controller = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(await sendOtpToMailService(req.body.email));
  } catch (error) {
    next(error);
  }
};

export const ForgetPassword: Controller = async (req, res, next) => {
  try {
    res
      .status(StatusCodes.OK)
      .json(await forgetPasswordService(req.body.email));
  } catch (error) {
    next(error);
  }
};

export const ResetPassword: Controller = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    res
      .status(StatusCodes.OK)
      .json(await resetPasswordService(email, password, otp));
  } catch (error) {
    next(error);
  }
};
