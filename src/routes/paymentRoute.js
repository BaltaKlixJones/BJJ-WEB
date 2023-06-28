const { Router } = require("express");
const mercadopago = require("mercadopago");
const router = require(".");
require("dotenv").config();
const { User } = require("../db");
require("dotenv").config();
const { ACCESS_TOKEN, SUCCESS_URL_MP, FAIL_URL_MP} = process.env;
const axios = require("axios");

const paymentRouter = Router();

mercadopago.configure({
  access_token:
  ACCESS_TOKEN,
});


paymentRouter.post("/create_preference/:id", async (req, res) => {

 const result = await mercadopago.preferences.create({
  items: [{
    title: "Cris Velasco BJJ",
    unit_price: 10000,
    currency_id: "ARS",
    quantity: 1,
  }],
  back_urls: {
    success: SUCCESS_URL_MP,
    failure: FAIL_URL_MP,
    pending: "",
  },
  auto_return: "approved",
  //  notification_url: `https://afa7-2800-22c3-80-d5-6d24-8bf9-2911-3992.sa.ngrok.io/Home`,
 })

//  console.log(result)
 res.send(result.body)
})

paymentRouter.post("/webhook", (req, res) => {
  console.log(req.query)
  res.send("webook")
})

// Pagos por 3 meses
// paymentRouter.post("/create_preference/:id", (req, res) => {

//   const {id} = req.params

//   console.log("userId",id)
//   let preference = {
//     items: [
//       {
//         title: "Cris Velasco BJJ",
//         unit_price: 1,
//         quantity: 1,
//       },
//     ],
//     back_urls: {
//       success: `http://localhost:5173/paymentAproved/`,
//       failure: `http://localhost:5173/paymentFailed/`,
//       pending: "",
//     },
//     auto_return: "approved",
//     currency_id: "ARS",
//   };

//   mercadopago.preferences
//     .create(preference)
//     .then((response) => {
//       const paymentId = response.body.id;
//       const { id } = req.params;
//       res.status(200).json({ message: "Pago exitoso" });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).json({ error: error.message });
//     });
// });

// Suscripciones por mes

paymentRouter.post("/createPlan/:id", (req, res) => {
  const url = "https://api.mercadopago.com/preapproval_plan";
  const { id } = req.params;
  const user = User.findByPk(id);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer TEST-1162236082592845-052208-73c6086ffc522d8f8fbaa18a65c6fed9-183639754`,
  };
  const data = {
    description: "Cris Velasco BJJ",
    reason: "Cris Velasco BJJ",
    payer_email: user.email,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      repetitions: null,
      billing_day_proportional: false,
      transaction_amount: 4000,
      currency_id: "ARS",
      start_date: new Date(),
    },
    status: "active",
    back_url: "https://www.crisvelascobjj.com/paymentAprovedMensual", // https://www.crisvelascobjj.com/paymentAprovedMensual/
  };
  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log(response.data);
      const preapproval_plan_id = response.data.id;

      data.preapproval_plan_id = preapproval_plan_id;

      res.status(200).send(response.data);
    })

    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al crear el plan");
    });
});

// paymentRouter.put("/updatePlan/:id", async (req, res) => {
//   try {
//     const id = "8aecb584884268f60188460bb05a0381";
//     const cancelUrl = `https://api.mercadopago.com/preapproval/${id}`;

//     const response = await axios.put(
//       cancelUrl,
//       {
//         status: "cancelled",
//         back_url: "https://google.com", // Aquí debes proporcionar la URL correcta
//       },
//       {
//         headers: {
//           Authorization:
//             "Bearer TEST-1162236082592845-052208-73c6086ffc522d8f8fbaa18a65c6fed9-183639754",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.status === 200 && response.data.status === "cancelled") {
//       await User.update(
//         {
//           subscription: false,
//           subscriptionDate: new Date(),
//         },
//         {
//           where: { id: id },
//         }
//       );

//       return res.status(200).json({ message: "Pago cancelado" });
//     } else {
//       return res.status(400).json({ message: "Error al cancelar el pago" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Error al actualizar el plan");
//   }
// });


paymentRouter.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

module.exports = paymentRouter;
