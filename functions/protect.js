const { promisify } = require("util");
const jwt = require("jsonwebtoken");
import User from "../models/userModel";

export const Authentication = {};

const Auth = async (req, ...roles) => {
  if (Authentication.validated === true) {
    return;
  }
  let token;
  if (req.headers.cookie && req.headers.cookie.startsWith("jwt")) {
    token = req.headers.cookie.split("=")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    Authentication.msg = "token not found";
    Authentication.statusCode = 401;
    return;
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    Authentication.validated = false;
    Authentication.msg = "user not found";
    Authentication.statusCode = 401;
    console.log(Authentication);
    return;
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    Authentication.validated = false;
    Authentication.msg = "password recently changed";
    Authentication.statusCode = 401;
    return;
  }
  if (currentUser.active === false) {
    Authentication.validated = false;
    Authentication.msg = "Account Locked please contact support";
    Authentication.statusCode = 401;
    return;
  }
  if (!roles.includes(currentUser.role)) {
    Authentication.validated = false;
    Authentication.msg = "User access to this route is forbidden";
    Authentication.statusCode = 401;
    return;
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  Authentication.validated = true;
  Authentication.msg = "Valid User";
  Authentication.statusCode = 200;
  Authentication.user = currentUser;
  return;
};

export default Auth;
