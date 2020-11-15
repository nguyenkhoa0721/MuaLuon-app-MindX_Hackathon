const crypto = require("crypto");

const user = require("../model/user_model");
const multer = require("multer");
const showRes = require("../utils/showRes");
const gm = require("gm");

const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 1024 * 1024 * 2 },
  //fileFilter: multerFilter,
});
exports.uploadAvatar = upload.single("avatar");
const upFile = upload.single("avatar");

exports.getInfo = async (req, res) => {
  if (!req.params.id) req.params.id = req.id;
  if (req.id == req.params.id) {
    let tfuser = user
      .findById(req.params.id)
      .populate({
        path: "myRoom",
        select: "name -member -adminRoom",
      })
      .populate({
        path: "joinRoom",
        select: "name -member -adminRoom",
      });

    if (req.query.field) {
      const field = req.query.field.split(",");
      tfuser.select(field);
    }

    const fuser = await tfuser;

    fuser.password = undefined;
    fuser.changePasswordAt = undefined;
    fuser.passwordResetExpries = undefined;
    fuser.passwordResetToken = undefined;
    res.status(200).json({
      fuser,
    });
  } else {
    const fuser = await user.findById(req.params.id);
    fuser.password = undefined;
    fuser.changePasswordAt = undefined;
    fuser.passwordResetExpries = undefined;
    fuser.passwordResetToken = undefined;
    res.status(200).json({
      fuser,
    });
  }
};
exports.getBasicInfo = async (req, res) => {
  const fuser = await user.findById(req.id);
  fuser.password = undefined;
  fuser.changePasswordAt = undefined;
  fuser.passwordResetExpries = undefined;
  fuser.passwordResetToken = undefined;
  res.status(200).json({
    fuser,
  });
};
exports.updateUser = async (req, res) => {
  const fuser = await user.findById(req.id);
  const keys = ["name", "phone", "bio", "job", "address", "gender", "birth"];
  keys.forEach((e) => {
    if (req.body[e] != undefined) {
      fuser[e] = req.body[e];
    }
  });
  if (req.file) {
    fuser["avt"] = `avatar-${req.user.id}.png`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .png()
      .toFile(`public/avatars/${fuser["avt"]}`);
  }
  await fuser.save();
  showRes(res, 200, {
    msg: "update success",
  });
};
exports.uploadFile = (req, res, next) => {
  upFile(req, res, (err) => {
    if (err) {
      showRes(res, 400, "file qua lon");
      req.fileID = "delete";
    }
    next();
  });
};

exports.changeAvt = async (req, res) => {
  const fuser = await user.findById(req.id);
  fuser.avt = req.fileID;
  await fuser.save();
  fd = "./fileUpload/avt/" + req.fileID;
  await gm(fd)
    .resize("400", "400", "^")
    .gravity("Center")
    .crop("400", "400")
    .write(fd, function (err) {
      if (!err) console.log(" hooray! ");
    });
  showRes(res, 200, {
    msg: "create session success",
  });
};

// /shops-within/:distance/center/:latlng/
exports.findShopWithinDistance = async (req, res, next) => {
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = distance / 6378.1;

  const sellers = await user.find({
    shopAddress: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: sellers.length,
    data: {
      data: sellers,
    },
  });
};

exports.getHashForChatRoom = (req, res, next) => {
  console.log(req.body.firstId, req.body.secondId);
  if (
    !req.user._id.equals(req.body.firstId) &&
    !req.user._id.equals(req.body.secondId)
  ) {
    return res.status(400).json({
      status: "fail",
      message: "You are not allowed to perform this action",
    });
  }
  let { firstId, secondId } = req.body;
  if (firstId.localeCompare(secondId) !== -1) {
    [firstId, secondId] = [secondId, firstId];
  }

  const hash = crypto
    .createHash("sha256")
    .update(firstId + secondId)
    .digest("hex");

  res.status(200).json({
    status: "success",
    hash,
  });
};
