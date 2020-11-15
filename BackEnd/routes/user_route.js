const express = require("express");
const { router } = require("../app");
const auth_ctrl = require("./../controler/auth_controler");
const user_ctrl = require("./../controler/user_controler");
const billController = require("./../controler/billController");
const goodController = require("./../controler/goodController");
const route = express.Router();

route.post("/signup", auth_ctrl.signup);
route.post("/login", auth_ctrl.login);
route.get("/logout", auth_ctrl.logout);
route.get("/islogged", auth_ctrl.islogged);
route.post("/forgotpass", auth_ctrl.forgotpassword);
route.patch("/resetpass/:token", auth_ctrl.resetpassword);
route.patch("/updatepassword", auth_ctrl.protect, auth_ctrl.changepassword);
route.patch(
  "/updateuser",
  auth_ctrl.protect,
  user_ctrl.uploadAvatar,
  user_ctrl.updateUser
);
route.post(
  "/updateavt",
  auth_ctrl.protect,
  user_ctrl.uploadFile,
  user_ctrl.changeAvt
);

route.get("/basic/", auth_ctrl.protect, user_ctrl.getBasicInfo);
route.get("/:id", auth_ctrl.protect, user_ctrl.getInfo);

route.get("/:userId/bills", billController.getBillsByUserId);

route.get("/:id/goods", goodController.getAllGoods);
route.patch(
  "/addGood",
  auth_ctrl.protect,
  goodController.uploadGoodImage,
  goodController.addGood
);
route.patch("/removeGood", auth_ctrl.protect, goodController.removeGood);

route.get(
  "/shops-within/:distance/center/:latlng/",
  user_ctrl.findShopWithinDistance
);
route.post(
  "/getHashForChatRoom",
  auth_ctrl.protect,
  user_ctrl.getHashForChatRoom
);
//dev
route.route("/").get(auth_ctrl.protect, user_ctrl.getInfo);
//=================
module.exports = route;
