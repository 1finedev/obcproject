import createSendToken from "../../../functions/createSendToken";
import Auth, { Authentication } from "../../../functions/protect";
import User from "../../../models/userModel";
import dbConnect from "../../../functions/dbConnect";
import sendEmail from "../../../utils/email";

export default function handler(req, res) {
  return new Promise(async (resolve) => {
    // Function to filter out unwanted fields
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };

    const {
      query: { endpoint },
      method,
    } = req;

    if (!endpoint || !method) {
      res
        .status(404)
        .json({ status: "error", msg: "query and method undefined" });
    }
    if (endpoint === "login" && method === "POST") {
      try {
        await dbConnect();
        const { username, password } = req.body;

        // 1) Check if email and password exist
        if (!username || !password) {
          return res.status(404).json({
            status: "error",
            msg: "Please provide username and password!",
          });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({
          username,
        }).select("+password");
        if (!user || !(await user.correctPassword(password, user.password))) {
          return res.status(404).json({
            status: "error",
            msg: "Incorrect Username or Password!",
          });
        }
        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
      } catch (error) {
        res.status(400).json({ status: "error", msg: error.message });
      }
    } else if (endpoint === "logout" && method === "POST") {
      try {
        await Auth(req, "user", "staff", "suuper");
        if (Authentication.validated === true) {
          res.setHeader(
            "Set-Cookie",
            serialize("jwt", "deleteAuthToken", {
              expires: new Date(Date.now() + 10 * 1000),
              httpOnly: true,
            })
          );
          res.status(200).json({ status: "success" });
        } else {
          res
            .status(Authentication.statusCode)
            .json({ status: "error", msg: Authentication.msg });
        }
      } catch (error) {
        res.status(400).json({ status: "error", msg: error.message });
      }
    } else if (endpoint === "forgotPassword" && method === "POST") {
      await dbConnect();
      // 1) Get user based on POSTed email
      const enteredEmail = req.body.email;
      if (!enteredEmail) {
        return res
          .status(404)
          .json({ status: "error", msg: "Please enter email" });
      }
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).json({
          status: "error",
          msg: `Unfortunately!, the email address '${enteredEmail}' did not match any user`,
        });
      }

      // 2) Generate the random reset token and save in DB
      const resetToken = user.createPasswordResetToken();
      await user.save({
        validateBeforeSave: false,
      });

      // 3) Send reset token it to user's email

      const protocol = "http";
      const host = req.headers.host;
      const resetURL = `${protocol}://${host}/users/resetPassword/+${resetToken}`;
      const message = `Forgot your User Account password? \n \n Open this link in a browser to reset your password \n\n  ${resetURL}.\n \nIf you didn't initiate a request to reset your password, please ignore this email! and contact user support immediately to guard against a hack on your account \n \n Thanks \n\n Support Team`;
      try {
        await sendEmail({
          email: user.email,
          subject: "Account Password reset token (valid for 10 min!!!)",
          message,
        });

        res.status(200).json({
          status: "success",
          message: `Token sent to ${enteredEmail}!`,
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
          validateBeforeSave: false,
        });

        return res.status(500).json({
          status: "error",
          msg: "There was an error sending the email. Please Try again later!",
        });
      }
    } else if (endpoint === "changePassword" && method === "PATCH") {
      try {
        await dbConnect();
        await Auth(req, "user", "staff", "suuper");
        if (Authentication.validated === true) {
          // 1) Get user from collection
          const user = await User.findById(Authentication.user._id).select(
            "+password"
          );

          // 2) Check if POSTed current password is correct
          if (
            !(await user.correctPassword(
              req.body.passwordCurrent,
              user.password
            ))
          ) {
            return res.status(401).json({
              status: "Error.",
              msg: "Your current password is wrong.",
            });
          }

          // 3) If so, update password
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          await user.save();
          // User.findByIdAndUpdate will NOT work as intended!

          // 4) Log user in, send JWT
          createSendToken(user, 200, res);
        } else {
          res
            .status(Authentication.statusCode)
            .json({ status: "error", msg: Authentication.msg });
        }
      } catch (error) {
        res.status(400).json({ status: "error", msg: error.message });
      }
    } else if (endpoint === "updateMe" && method === "PATCH") {
      try {
        await Auth(req, "user", "staff", "suuper");
        if (Authentication.validated === true) {
          await dbConnect();
          // 1) Create error if user POSTs password data
          if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({
              status: "Error.",
              msg: "Password Updates not allowed lol",
            });
          }

          // 2) Filtered out unwanted fields names that are not allowed to be updated
          const filteredBody = filterObj(
            req.body,
            "name",
            "email",
            "refId",
            "username",
            "accountNo",
            "balance",
            "role",
            "referredCount",
            "passwordResetToken",
            "level"
          );

          // 3) Update user document
          const updatedUser = await User.findByIdAndUpdate(
            Authentication.user._id,
            filteredBody,
            {
              new: true,
              runValidators: true,
            }
          );

          res.status(200).json({
            status: "success",
            data: {
              user: updatedUser,
            },
          });
        } else {
          res
            .status(Authentication.statusCode)
            .json({ status: "error", msg: Authentication.msg });
        }
      } catch (error) {
        res.status(400).json({ status: "error", msg: error.message });
      }
    } else {
      return res.status(404).json({
        status: "error",
        msg: `No ${method} handler defined for /${endpoint} route!`,
      });
    }

    resolve();
  });
}
