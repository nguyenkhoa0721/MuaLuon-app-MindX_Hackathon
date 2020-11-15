const user = require("./../model/user_model");
const sharp = require("sharp");
const multer = require("multer");

const goodsMulterStorage = multer.memoryStorage();

const goodsUpload = multer({
  storage: goodsMulterStorage,
});

exports.uploadGoodImage = goodsUpload.single("image");
//Allow seller to add a good to their shop page
exports.addGood = async (req, res, next) => {
  const existedGood = await user.findOne({
    _id: req.user.id,
    "goods.name": req.body.name,
  });

  //We checked if the seller already has this good one his shop page
  if (existedGood) {
    return res.status(400).json({
      status: "failed",
      message: "Good already existed",
    });
  }
  const good = {
    name: req.body.name,
    price: req.body.price,
    image: `base.png`, //image of the good is optional so if the seller does not specify it , we just use base.png
  };
  if (req.file) {
    const imageName = `${req.body.name}-${req.user.id}-${Date.now()}.png`;
    good.image = imageName;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .png()
      .toFile(`public/goods/${imageName}`);
  }

  req.user.goods.push(good);
  req.user.save();

  res.status(200).json({
    status: "success",
    data: {
      good,
    },
  });
};

//Allow seller to remove a good from shop page
exports.removeGood = async (req, res, next) => {
  //Find the index of the good in the goods array
  let index;
  const { goods } = req.user;
  for (let i = 0; i < goods.length; ++i) {
    if (goods[i].name === req.body.name) {
      index = i;
      break;
    }
  }

  if (!index) {
    res.status(404).json({
      status: "failed",
      message: "No good is found with specified name",
    });
  }

  req.user.goods[index].remove();
  await req.user.save();

  res.status(200).json({
    status: "success",
    data: {
      goods: req.user.goods,
    },
  });
};

//Get all goods using a seller id
exports.getAllGoods = async (req, res, next) => {
  const currentUser = await user.findById(req.params.id);
  res.status(200).json({
    status: "success",
    result: currentUser.goods.length,
    data: {
      goods: currentUser.goods,
    },
  });
};
