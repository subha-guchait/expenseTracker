const { Cashfree } = require("cashfree-pg");
const { Transaction } = require("sequelize");

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const createorder = async (
  orderId,
  orderAmount,
  orderCurrency,
  customerID,
  customerPhone,
  customerName,
  customerEmail
) => {
  try {
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
      },
      order_meta: {
        // return_url:
        //   "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}",
        return_url: `http://localhost:3000/purchase/updatetransactionstatus/${orderId}`,
        notify_url:
          "https://www.cashfree.com/devstudio/preview/pg/webhooks/32129369",
        // payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
      order_note: "Sample Order Note",
      order_tags: {
        name: "Developer",
        company: "Cashfree",
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);

    console.log(
      " cashfree services payment session id ",
      response.data.payment_session_id
    );

    return response.data.payment_session_id;
  } catch (err) {
    console.log("Error creating order:", err.message);
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

    let getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Sucess";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failed";
    }

    console.log("Order Status:", orderStatus);
    return orderStatus;
  } catch (err) {
    console.log("Error fetching payment status:", err.message);
  }
};

module.exports = { createorder, getPaymentStatus };
