const express = require("express");
const fs = require("fs");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(morgan("tiny"));
app.use;

const user_route = require("./routes/user_route");
const billRoute = require("./routes/billRoute");

const auth_ctrl = require("./controler/auth_controler");

const middle = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};
//===============================
// const enableCrossDomain = function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   next();
// };
// app.use(enableCrossDomain);
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(cookieParser());

//==============================
app.use("/static", auth_ctrl.protect, express.static("public"));
//==============================

app.use("/api/v1/user/", user_route);
app.use("/api/v1/bill/", billRoute);
module.exports = app;
