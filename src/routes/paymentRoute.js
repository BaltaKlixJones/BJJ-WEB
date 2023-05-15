const { Router } = require("express");
const mercadopago = require("mercadopago");
const router = require(".");
require("dotenv").config();
// const { User } = require("../db");
require("dotenv").config();
const {ACCESS_TOKEN} = process.env;

const paymentRouter = Router();

mercadopago.configure({
  access_token:
    ACCESS_TOKEN,
});

paymentRouter.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: "Descripcion del producto",
        unit_price: 1,
        quantity: 1,
      },
    ],
    back_urls: {
      success: "http://localhost:5173/paymentApproved",
      failure: "http://localhost:5173/payementFailed",
      pending: "",
    },
    auto_return: "approved",
    currency_id: "ARS",
  };

  mercadopago.preferences
    .create(preference)
    .then(
      (response) => 
    //   console.log(response),
      res.status(200).json({ response }))
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: error.message });
    });
});

paymentRouter.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

module.exports = paymentRouter;
