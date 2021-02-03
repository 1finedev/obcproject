import User from "../../../../models/userModel";
import dbConnect from "../../../../functions/dbConnect";
const crypto = require("crypto");

export default function handler(req, res) {
  return new Promise(async (resolve) => {
    try {
      await dbConnect();
      const {
        query: { token },
        method,
      } = req;
      if (method === "PATCH") {
        // 1) Get user based on the token
        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        const user = await User.findOne({
          passwordResetToken: hashedToken,
          passwordResetExpires: {
            $gt: Date.now(),
          },
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
          return res
            .status(400)
            .json({ status: "error", msg: "invalid or expired token" });
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        createSendToken(user, 200, res);
      } else {
        res.status(400).json({
          status: "error",
          msg: `No ${method} handler defined for /${endpoint} route!`,
        });
      }
    } catch (error) {
      res.status(400).json({ status: "error", msg: error.message });
    }
    resolve();
  });
}
