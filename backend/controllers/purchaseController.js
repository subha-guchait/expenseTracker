const Order = require("../models/order");
const User = require("../models/user");
const { generateOrderId } = require("../services/generateorderidservice");
const {
  createorder,
  getPaymentStatus,
} = require("../services/cashfreeservice");

exports.processpayment = async (req, res, next) => {
  const name = req.user.name;
  const email = req.user.email;

  const orderId = "ORDER-" + generateOrderId();
  const orderAmount = 100;
  const orderCurrency = "INR";
  const customerID = "devstudio_user";
  const customerPhone = "9999999999";

  try {
    const paymentSessionId = await createorder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone,
      name,
      email
    );
    console.log("payment session id:", paymentSessionId);

    //save the payment details in the database
    await Order.create({
      orderid: orderId,
      paymentsessionid: paymentSessionId,
      orderamount: orderAmount,
      ordercurrency: orderCurrency,
      customeremail: email,
      paymentstatus: "pending",
      userId: req.user.id,
    });

    res.json({ paymentSessionId, orderId });
  } catch (err) {
    console.error("Error processing payment:", err.message);
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const orderStatus = await getPaymentStatus(orderId);
    //update the payment status in the database
    const order = await Order.findOne({ where: { orderid: orderId } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //update the order status
    order.paymentstatus = orderStatus;
    await order.save();

    console.log("userId :", order.userId);

    //update the user to premium user
    if (orderStatus === "Sucess") {
      const user = await User.findOne({ where: { id: order.userId } });
      user.ispremiumuser = true;
      await user.save();
    }

    res.json({ orderStatus });
  } catch (err) {
    console.error("Error updating transaction status:", err.message);
    res.status(500).json({ message: "Error updating transaction status" });
  }
};

exports.getOrderStatus = async (req, res, next) => {};
