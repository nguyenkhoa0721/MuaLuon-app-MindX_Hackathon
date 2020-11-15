const Bill = require("../model/billModel");
const user = require("../model/user_model");

exports.blockCompletedBill = async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  if (bill.status >= 4) {
    return res.status(400).json({
      status: "failed",
      message: "Completed bill can not be modified",
    });
  }
  next();
};

exports.createBill = async (req, res, next) => {
  //At one time , a buyer and a seller can only have ONE in processed bill
  const existedBill = await Bill.findOne({
    buyer: req.body.buyer,
    seller: req.body.seller,
    status: { $lt: 4 }, //status 4: This mean the bill had already completed (buyer already received the items and paid the bills) but in this case we only want to find incompleted bill
  });

  //If we found an incompleted bill by this buyer and seller then just response 400 (BAD REQUEST)
  if (existedBill) {
    return res.status(400).json({
      status: "fail",
      message: "A bill with this buyer and seller is in process",
    });
  }

  //Create a new bill base on the request data
  const bill = await (await Bill.create(req.body))
    .populate({
      path: "buyerInfo",
      options: {
        select:
          "-password -passwordChangeAt -passwordResetToken -passwordResetExpires",
      },
    })
    .populate({
      path: "sellerInfo",
      options: {
        select:
          "-password -passwordChangeAt -passwordResetToken -passwordResetExpires",
      },
    })
    .execPopulate();

  res.status(201).json({
    status: "success",
    data: {
      bill,
    },
  });
};

exports.getBill = async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
};

exports.getAllBills = async (req, res, next) => {
  const bills = await Bill.find();

  res.status(200).json({
    status: "success",
    result: bills.length,
    data: {
      bills,
    },
  });
};

exports.updateBill = async (req, res, next) => {
  console.log(req.body);
  const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
};

exports.deleteBill = async (req, res, next) => {
  const bill = await Bill.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
};

//This controller helps the buyer to add new items to the bills or modify the number of existed items
exports.updateItems = async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  const { items } = req.body;
  const existedItems = bill.items; //get all items that are already on the bills

  await Promise.all(
    items.map(async (item) => {
      const existedItem = await Bill.findOne({
        _id: req.params.id,
        "items.name": item.name,
      }); //Checking if the current item we receive from the request is already on the bill or not

      if (existedItem) {
        //If the item is already on the bill , just find the right index of it in the array and update the number
        let index;
        for (let i = 0; i < existedItems.length; ++i) {
          if (existedItems[i].name === item.name) {
            index = i;
            break;
          }
        }
        bill.items[index].number = item.number;
      } else {
        bill.items.push(item);
      }
      return item;
    })
  );

  await bill.save();
  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
};

//This controller helps to remove items from the bills
exports.removeItems = async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  const items = bill.items;

  const { itemNames } = req.body; //Receive an array of item names that the seller wants to remove from the bill

  await Promise.all(
    //For each item name  , we find the index of that item in the items array and delete it (if it existed)
    itemNames.map((itemName) => {
      let index;
      for (let i = 0; i < items.length; ++i) {
        if (items[i].name === itemName) {
          index = i;
          break;
        }
      }
      if (index) {
        bill.items[index].remove();
      }
    })
  );
  await bill.save();

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
};

//This controller will get the current incompleted bill (status < 4) of the current logged in user and another user (specified already in requested)
exports.getBillByTwo = async (req, res, next) => {
  let buyerId, sellerId;

  //If the current logged in user is a buyer , then the id parameter in the request query must be an id of a seller , vice versa
  if (req.user.role === "buyer") {
    buyerId = req.user.id;
    sellerId = req.params.id;
  } else {
    buyerId = req.params.id;
    sellerId = req.user.id;
  }

  //Find the incompleted bill
  const bill = await Bill.findOne({
    buyer: buyerId,
    seller: sellerId,
    status: { $lt: 4 },
  });

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
};

//Get all the bills from the past of an user specified by request
exports.getBillsByUserId = async (req, res, next) => {
  const currentUser = await user
    .findById(req.params.userId)
    .populate({ path: "sellerBills", options: { sort: "-date" } })
    .populate({ path: "buyerBills", options: { sort: "-date" } });

  //Based on their role , the users will have different kinds of bills
  let bills;
  if (currentUser.role === "seller") {
    bills = currentUser.sellerBills;
  } else {
    bills = currentUser.buyerBills;
  }

  res.status(200).json({
    status: "success",
    result: bills.length,
    data: {
      role: currentUser.role,
      bills,
    },
  });
};
