import express from "express";
import { joiValidator } from "../../utils/validator.js";
import validation from "../../utils/validator.js";
import * as controller from "./controller.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

router.post("/signup", joiValidator(validation.create), controller.Create);

//
// Logout Route
router.get("/logout/", verifyToken, controller.Logout);

// Verify Email Route
router.post(
  "/verify-email",
  joiValidator(validation.verifyEmail),
  controller.VerifyEmail
);

// Send OTP to Mail Route
router.post(
  "/otp-email",
  joiValidator(validation.sendOtpToMail),
  controller.SendOtpToEmail
);

// Login Route
router.post("/login", joiValidator(validation.login), controller.Login);

// Forget Password Route
router.post(
  "/forget-password",
  joiValidator(validation.forgetPassword),
  controller.ForgetPassword
);

// Reset Password Route
router.post(
  "/rest-password",
  joiValidator(validation.restPassword),
  controller.ResetPassword
);

export default router;
