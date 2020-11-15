const fs = require("fs");
const user = require("../model/user_model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("./../utils/email");
const showRes = require("../utils/showRes");
const changeTime = require("../utils/changetimestamp");

const signtoken = (req, res, id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_CODE, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPRIES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  res.cookie("jwt", token, cookieOption);
  res.status(200).json({
    status: "success",
    token,
  });
};
exports.signup = async (req, res) => {
  try {
    req.body.avt = "de.png";
    const fuser = await user.create(req.body);
    await signtoken(req, res, fuser._id);
  } catch (err) {
    showRes(res, 401, err);
  }
};
exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({
      status: "fail",
      error: "email password ban eii",
    });
    return;
  }

  const fuser = await user.findOne({ email: email });

  if (!fuser || !(await fuser.correctPassword(password, fuser.password))) {
    showRes(res, 401, "current password is wrong");
    return;
  }
  signtoken(req, res, fuser._id);
};
exports.logout = async (req, res) => {
  const cookieOption = {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  res.cookie("jwt", "logout", cookieOption);
  showRes(res, 200, {
    msg: "log out",
  });
};
exports.islogged = async (req, res) => {
  let token;
  console.log(req.cookies.jwt);
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    res.status(401).json({
      status: "fail",
      error: "bạn login vào đi bạn êii",
    });
    return;
  }
  let verify;
  try {
    verify = await jwt.verify(token, process.env.JWT_CODE);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: "logout",
    });
    return;
  }
  const fuser = await user.findById(verify.id);
  if (!fuser) {
    console.log(1);
    res.status(400).json({
      status: "fail",
      error: "something wrong",
    });
    return;
  }
  if (verify.iat < changeTime(fuser.changePasswordAt)) {
    showRes(res, 400, "token het han");
    return;
  }
  fuser.password = undefined;
  fuser.changePasswordAt = undefined;
  fuser.passwordResetExpries = undefined;
  fuser.passwordResetToken = undefined;
  res.status(200).json({
    fuser,
  });
};
exports.forgotpassword = async (req, res) => {
  const fuser = await user.findOne({ email: req.body.email });

  if (!fuser) {
    showRes(res, 401, "email ch dang ky");
    return;
  }

  const resetToken = await fuser.createPasswordResetToken();
  fuser.save();
  //==========================

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPass/${resetToken}`;
  const message = `${resetURL}`;

  await sendEmail({
    email: fuser.email,
    subject: "password reset token",
    message,
  });

  showRes(res, 200, {
    message: "kiem tra email",
  });
};
exports.resetpassword = async (req, res) => {
  resetToken = await crypto
    .createHash("HS256")
    .update(req.params.token)
    .digest("hex");
  fuser = await user.findOne({
    passwordResetToken: resetToken,
    passwordResetExpries: { $gt: Date.now() },
  });

  if (!fuser) {
    showRes(res, 401, "resetToken fail");
    return;
  }
  fuser.password = req.body.password;
  fuser.passwordResetToken = undefined;
  fuser.passwordResetExpries = undefined;
  await fuser.save();
  showRes(res, 200, {
    message: "update thanh cong",
  });
};
exports.changepassword = async (req, res) => {
  const fuser = await user.findById(req.id);
  correctOldPassword = await fuser.correctPassword(
    req.body.oldpassword,
    fuser.password
  );
  if (!correctOldPassword) {
    showRes(res, 401, "current password is wrong");
    return;
  }
  fuser.password = req.body.newpassword;
  await fuser.save();

  signtoken(req, res, fuser._id);
};
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    res.status(401).json({
      status: "fail",
      error: "bạn login vào đi bạn êii",
    });
    return;
  }
  const verify = await jwt.verify(token, process.env.JWT_CODE);
  const freshuser = await user
    .findById(verify.id)
    .populate({
      path: "myRoom",
      select: "name -member -adminRoom",
    })
    .populate({
      path: "joinRoom",
      select: "name -member -adminRoom",
    });
  if (!freshuser) {
    res.status(401).json({
      status: "fail",
      error: "something wrong",
    });
    return;
  }
  if (verify.iat < changeTime(freshuser.changePasswordAt)) {
    showRes(res, 401, "token het han");
    return;
  }
  req.user = freshuser;
  req.id = freshuser._id;
  req.userInfo = freshuser;
  next();
};
