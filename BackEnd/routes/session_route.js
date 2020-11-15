const express = require('express');
const auth_ctrl = require('./../controler/auth_controler');
const session_ctrl = require('./../controler/session_controler');
const ans_ctrl = require('./../controler/ans_controler');
const cmt_ctrl = require('./../controler/cmt_controler');
const progress_ctrl=require('./../controler/progress_controler');
const route = express.Router();

route
    .route("/:id")
    .get(auth_ctrl.protect,session_ctrl.pm("admin","member"),session_ctrl.getSession)
    .post(auth_ctrl.protect,session_ctrl.pm("member"),
        ans_ctrl.remake,
        ans_ctrl.createNewAnswer,
        ans_ctrl.uploadFile,
        ans_ctrl.createNewAnswerWithFile)
    .patch(auth_ctrl.protect,session_ctrl.pm("admin"),session_ctrl.updateSession)
    .delete(auth_ctrl.protect,session_ctrl.pm("admin"),session_ctrl.deleteSession);

route
    .route("/:id/chamTN")
    .post(auth_ctrl.protect,session_ctrl.pm("admin"),ans_ctrl.chamTN)

route
    .route("/:id/file")
    .post(auth_ctrl.protect,session_ctrl.pm("admin"),session_ctrl.uploadFile,session_ctrl.After)
//========cmt==========
route
    .route("/:id/cmt")
    .post(auth_ctrl.protect,session_ctrl.pm("admin","member"),cmt_ctrl.postCmt)
route
    .route("/cmt/:id")
    .delete(auth_ctrl.protect,cmt_ctrl.deleteCmt)
//========progress==========
route
    .route("/:id/progress")
    .post(auth_ctrl.protect,session_ctrl.pm("admin","member"),progress_ctrl.postProgress)
route
    .route("/:id/progress/:idpro")
    .delete(auth_ctrl.protect,session_ctrl.pm("admin","member"),progress_ctrl.deleteProgress)
    .patch(auth_ctrl.protect,session_ctrl.pm("admin","member"),progress_ctrl.updateProgress)

module.exports=route;
