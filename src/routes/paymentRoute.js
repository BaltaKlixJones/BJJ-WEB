const { Router } = require("express");
const mercadopago = require("mercadopago");
const router = require(".");
require("dotenv").config();
const { User } = require("../db");
require("dotenv").config();
const { ACCESS_TOKEN_PRUEBA } = process.env;
const axios = require("axios");

const paymentRouter = Router();

mercadopago.configure({
  access_token: "TEST-1162236082592845-052208-73c6086ffc522d8f8fbaa18a65c6fed9-183639754",
});


// Pagos por 3 meses
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

      // User.findByPk(id)
      //   .then((user) => {
      //     if (user) {
      //       const currentDate = new Date();
      //       const subscriptionDateEnd = new Date();
      //       subscriptionDateEnd.setMonth(subscriptionDateEnd.getMonth() + 3);
      //       User.update(
      //         {
      //           subscription: true,
      //           subscriptionDate: currentDate,
      //           subscriptionDateEnd: subscriptionDateEnd,
      //           subscriptionType: 3,
      //         },
      //         {
      //           where: { id: user.id },
      //       }
      //       )
      res.status(200).json({ message: "Pago exitoso" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: error.message });
    });
  });
              
//                 res.status(200).json({ message: "Pago exitoso" });
//               })

//               .catch((error) => {
//                 console.log(error);
//                 res.status(400).json({ error: error.message });
//               });
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           res.status(400).json({ error: error.message });
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).json({ error: error.message });
//     });
// });


// Suscripciones por mes 

paymentRouter.post("/createPlan/:id", (req, res) => {
  const url = 'https://api.mercadopago.com/preapproval_plan';
  const {id} = req.params;
  const user = User.findByPk(id)
  
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
      transaction_amount: 5,
      currency_id: "ARS",
      start_date: new Date(),
    },
    status: "active",
    back_url: "https://www.google.com/",
  };
  axios.post(url, data, { headers })
  .then (response => {
    console.log(response.data);
    const preapproval_plan_id = response.data.id;
    
    data.preapproval_plan_id = preapproval_plan_id;

    const currentDate = new Date();
    const subscriptionDateEnd = new Date(currentDate);
    subscriptionDateEnd.setMonth(subscriptionDateEnd.getMonth() + 1);


    User.findByPk(id)
            .then((user) => {
              if (user) {
                User.update(
                  {
                    subscription: true,
                    subscriptionDate: currentDate,
                    subscriptionDateEnd: subscriptionDateEnd,
                    subscriptionType: 1,
                   
                  },
                  {
                    where: { id: user.id },
                  }
                )
              }
            })

    res.status(200).send(response.data);
  })

  .catch(error => {
    console.log(error);
    res.status(500).send("Error al crear el plan")
  })

});


paymentRouter.put("/updatePlan/:id", async (req, res) => {
  try {
    const id = "8aecb584884268f60188460bb05a0381";
    const cancelUrl = `https://api.mercadopago.com/preapproval/${id}`;

    const response = await axios.put(cancelUrl, {
      
      status: "cancelled",
      back_url: "https://google.com", // Aquí debes proporcionar la URL correcta
    }, {
      headers: {
        Authorization: 'Bearer TEST-1162236082592845-052208-73c6086ffc522d8f8fbaa18a65c6fed9-183639754',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 && response.data.status === 'cancelled') {
      await User.update(
        {
          subscription: false,
          subscriptionDate: new Date(),
        
        },
        {
          where: { id: id },
        }
      );

      return res.status(200).json({ message: 'Pago cancelado' });
    } else {
      return res.status(400).json({ message: 'Error al cancelar el pago' });
    }
  } catch (error) {
    console.log(error); 
    return res.status(500).send("Error al actualizar el plan");
  }
});





paymentRouter.get("/allPayments", async (req, res) => {
  try {
    const urlPayments = "https://api.mercadopago.com/v1/payments/search";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer TEST-1162236082592845-052208-73c6086ffc522d8f8fbaa18a65c6fed9-183639754",
    };

    const response = await axios.get(urlPayments, {
      headers: headers,
    });

    if (response.status === 200) {
      const payments = response.data.results;
      console.log(payments)
      res.status(200).json(payments);
    } else {
      res.status(500).json({ message: "Error al obtener los pagos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los pagos" });
  }
});






// paymentRouter.post("/pago/:id", (req, res) => {
//   const { user } = req.body;
//   // const {planId} = res.body;
//   // console.log(planId);
//   console.log(user)
//   const plan = {
//     preapproval_plan_id: "2c9380848833918d018840d999f10564",
//     reason: "Cris Velasco BJJ",
//     payer_email: User.email,
//     card_token_id: "e3ed6f098462036dd2cbabe314b9de2a",
//     auto_recurring: {
//       frequency: 1,
//       frequency_type: "months",
//       transaction_amount: 1,
//       currency_id: "ARS",
//     },
//     back_url: "http://localhost:5173/paymentApproved",
//   };

//   // crear plan de pago
//   mercadopago.preapproval.create(plan)
//     .then((response) => {
//       console.log(response)
//       // Aquí puedes realizar alguna acción adicional después de procesar el pago
//       const { id } = req.params;
//       const planId = response.body.id;
//       //  console.log(planId);
//           plan.preapproval_plan_id = planId;
//       User.findByPk(id)
//         .then((user) => {
//           if (user) {
//             User.update(
//               {
//                 subscription: true,
//                 subscriptionDate: new Date(),
//               },
//               {
//                 where: { id: user.id },
//               }
//             )
//               .then(() => {
//                 res.status(200).json({ message: "Pago exitoso" });
//               })
//               .catch((error) => {
//                 console.log(error);
//                 res.status(400).json({ error: error.message });
//               });
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           res.status(400).json({ error: error.message });
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(400).json({ error: error.message });
//     });
// });


// paymentRouter.post("/pago/:id", (req, res) => {

//   const { user } = req.body;
//   console.log(user)
//   // console.log(mercadopago)

//   const plan = {
//     preapproval_plan_id: "2c9380848834ed920188404adeb104a9",
//     description: "Cris Velasco BJJ",
//      payer_email: user.email,
//     token: "123123",
//     auto_recurring: {
//       frequency: 1,
//       frequency_type: "months",
//       transaction_amount: 1,
//       currency_id: "ARS",
//     },
//     back_url: "http://localhost:5173/paymentApproved",
//   };
// // crear plan de pago
// mercadopago.payment
//   .create(plan)
//   .then((response) => {
//     const planId = response.body.id;
//     console.log(planId);
//     plan.preapproval_plan_id = planId;

//     mercadopago.preapproval
//       .create(plan)
//       .then((response) => {
//         console.log(response);
//         // Aquí puedes realizar alguna acción adicional después de procesar el pago
//         const { id } = req.params;

//         User.findByPk(id)
//           .then((user) => {
//             if (user) {
//               User.update(
//                 {
//                   subscription: true,
//                   subscriptionDate: new Date(),
//                 },
//                 {
//                   where: { id: user.id },
//                 }
//               )
//                 .then(() => {
//                   res.status(200).json({ message: "Pago exitoso" });
//                 })
//                 .catch((error) => {
//                   console.log(error);
//                   res.status(400).json({ error: error.message });
//                 });
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//             res.status(400).json({ error: error.message });
//           });
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//       });
//   })
//   .catch((error) => {
//     console.log(error);
//     res.status(400).json({ error: error.message });
//   });
// });


paymentRouter.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

module.exports = paymentRouter;
