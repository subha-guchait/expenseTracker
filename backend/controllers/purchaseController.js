const { Cashfree } = require("cashfree-pg");
const crypto = require("crypto");

const Order = require("../models/order");
const UserController = require("./userController");

exports.purchasePremium = async (req, res, next) => {
  try {
    let request = {
      order_amount: 29,
      order_currency: "INR",
      order_id: generateOrderId(),
      customer_details: {
        customer_id: "devstudio_user",
        customer_phone: "8474090589",
      },
    };
    console.log("ok");

    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        console.log("Order created successfully:", response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response.data.message);
      });
  } catch (err) {}
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    res.json(response.data);
  } catch (err) {}
};
