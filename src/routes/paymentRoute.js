const { Router } = require("express");
const mercadopago = require("mercadopago");
const router = require(".");
require("dotenv").config();
const { User } = require("../db");
require("dotenv").config();
const { ACCESS_TOKEN_PRUEBA } = process.env;

const paymentRouter = Router();

mercadopago.configure({
  access_token: ACCESS_TOKEN_PRUEBA,
});

paymentRouter.post("/create_preference/:id", (req, res) => {
  let preference = {
    items: [
      {
        title: "Cris Velasco BJJ",
        unit_price: 1,
        quantity: 1,
      },
    ],
    back_urls: {
      success: "http://localhost:5173/paymentAproved",
      failure: "http://localhost:5173/payementFailed",
      pending: "",
    },
    auto_return: "approved",
    currency_id: "ARS",
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      const paymentId = response.body.id;
      const { id } = req.params;

      User.findByPk(id)
        .then((user) => {
          if (user) {
            User.update(
              {
                subscription: true,
                subscriptionDate: new Date(),
              },
              {
                where: { id: user.id },
              }
            )
              .then(() => {
                res.status(200).json({ message: "Pago exitoso" });
              })
              .catch((error) => {
                console.log(error);
                res.status(400).json({ error: error.message });
              });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error.message });
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
