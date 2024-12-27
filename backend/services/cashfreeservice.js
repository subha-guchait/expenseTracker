const { Cashfree } = require("cashfree-pg");

const { generateOrderId } = require("../services/generateorderidservice");

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const createorder = async();
