// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../functions/dbConnect";
import Auth, { Authentication } from "../../../functions/protect";
import createSendToken from "../../../functions/createSendToken";
import User from "../../../models/userModel";

export default async (req, res) => {
  return new Promise(async (resolve) => {
    // Connect to database

    // request methods condition
    const { method } = req;

    if (method === "GET") {
      try {
        await dbConnect(true);

        await Auth(req, "user");
        if (Authentication.validated === true) {
          const users = await User.find({});
          await dbConnect(false);
          res
            .status(200)
            .json({ status: "success", total: users.length, data: users });
        } else {
          res
            .status(Authentication.statusCode)
            .json({ status: "error", msg: Authentication.msg });
        }
      } catch (error) {
        res.status(400).json({ status: "error", msg: error.message });
      }
    } else if (method === "POST") {
      try {
        await dbConnect(true);

        const { username, name, mobile, email } = req.body;
        const usernameUsed = await User.findOne({ username });
        if (usernameUsed) {
          return res.status(400).json({
            status: "error",
            msg: "Username has already been used",
          });
        }
        const emailUsed = await User.findOne({ email });
        if (emailUsed) {
          return res.status(400).json({
            status: "error",
            msg: "Email has already been used",
          });
        }
        const mobileUsed = await User.findOne({ mobile });
        if (mobileUsed) {
          return res.status(400).json({
            status: "error",
            msg: "Phone number has already been used",
          });
        }
        if (name.length < 10) {
          return res.status(400).json({
            status: "error",
            msg: "Name is less than 10 characters",
          });
        }
        const account = req.body.mobile.split("+")[1].substring(3);
        const newUser = await User.create({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          accountNo: account,
        });
        createSendToken(newUser, 201, res);
      } catch (error) {
        return res.status(400).json({ status: "error", msg: error.message });
      }
    } else {
      return res.status(404).json({
        status: "error",
        msg: `No ${method} handler defined for /${endpoint} route!`,
      });
    }
    resolve();
  });
};
