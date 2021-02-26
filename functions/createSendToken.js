const jwt = require("jsonwebtoken");
import { serialize } from "cookie";
import mongoose from "mongoose";
// function to sign token
const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
// function to create token and send response to client
const createSendToken = async (user, statusCode, res) => {
  // call token function
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
    path: "/",
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.setHeader("Set-Cookie", serialize("jwt", token, cookieOptions));

  // Remove password from output
  user.password = undefined;
  mongoose.disconnect();
  res.status(statusCode).json({ status: "success", token, data: user });
  return;
};

export default createSendToken;
