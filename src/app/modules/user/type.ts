export type UserDocument = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  verifiedEmail: boolean;
  otp: string;
  expired_at: Date;
  lastLogin: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): Promise<string>;
};

export type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  otp: string;
  expired_at: Date;
};
