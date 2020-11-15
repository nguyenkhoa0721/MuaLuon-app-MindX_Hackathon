const express = require('express');
const auth_ctrl = require('./../controler/auth_controler');
const session_ctrl = require('./../controler/session_controler');
const ans_ctrl = require('./../controler/ans_controler');
const route = express.Router();
route
    .route("/:ans_id")
    .get(auth_ctrl.protect,ans_ctrl.pm("admin","member","guest"),ans_ctrl.getAns)
    .post(auth_ctrl.protect,ans_ctrl.pm("admin"),ans_ctrl.reviewAnswer)
    .delete(auth_ctrl.protect,ans_ctrl.pm("member","admin"),ans_ctrl.deleteAnswer)
module.exports=route;