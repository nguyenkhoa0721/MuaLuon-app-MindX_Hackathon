const express = require("express");
const { router } = require("../app");

const authController = require("../controler/auth_controler");
const billController = require("../controler/billController");

const route = express.Router({ mergeParams: true });

route
  .route("/")
  .post(billController.createBill)
  .get(billController.getAllBills);
route
  .route("/:id")
  .get(billController.getBill)
  .delete(billController.deleteBill)
  .patch(billController.blockCompletedBill, billController.updateBill);
route.get("/other/:id", authController.protect, billController.getBillByTwo);

route.patch(
  "/:id/updateItems",
  billController.blockCompletedBill,
  billController.updateItems
);
route.patch(
  "/:id/removeItems",
  billController.blockCompletedBill,
  billController.removeItems
);

module.exports = route;
