const express = require('express');
const auth_ctrl = require('./../controler/auth_controler');
const room_ctrl = require('./../controler/room_controler');
const session_ctrl=require('./../controler/session_controler');
const route = express.Router();
route
    .route('/')
    .get(room_ctrl.getAllRoom)
    .post(auth_ctrl.protect,room_ctrl.createNewRoom)

route
    .route('/:id')
    .get(auth_ctrl.protect,room_ctrl.pm("admin","member"),room_ctrl.getRoom)
    .patch(auth_ctrl.protect,room_ctrl.pm("admin"),room_ctrl.updateRoom)
    .delete(auth_ctrl.protect,room_ctrl.pm("admin"),room_ctrl.deleteRoom)

route
    .route('/:id/member/')
    .post(auth_ctrl.protect,room_ctrl.joinRoom)
    .delete(auth_ctrl.protect,room_ctrl.pm("admin","member"),room_ctrl.kickOutRoom)

route
    .route('/:id/session/')
    .post(auth_ctrl.protect,room_ctrl.pm("admin"),
        session_ctrl.createNewSession)
        // session_ctrl.uploadFile,
        // session_ctrl.createNewSessionWithFile)
route
    .route('/:id/label/')
    .post(auth_ctrl.protect,room_ctrl.pm("admin"),
        room_ctrl.label)
module.exports = route; 