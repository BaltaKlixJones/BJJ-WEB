const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Sequelize = require("sequelize");
require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

const User = require("../models/user")(sequelize);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'baltakj@gmail.com',
        pass: 'cgkxjkqstddchkcs',

}})

function enviarCorreoCambioContrasena (req, res) {
    const destinatarioEmail = req.body.email;
    User.findOne({
        where: {
          email: destinatarioEmail
        }
      })
        .then(user => {
          if (user) {
            const destinatarioId = user.id;
    
            const mailOptions = {
              from: 'baltakj@gmail.com',
              to: destinatarioEmail,
              subject: 'Reestablecer Contraseña',
              text: `Hola! ${destinatarioEmail} \n¿Olvidaste tu contraseña? No te preocupes.\n\nIngresa al siguiente link: http://localhost:5173/changePassword/${destinatarioId}.\n\n \t¡No compartas este link con nadie!`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                  res.status(500).send(error.message);
                } else {
                  console.log('Email enviado');
                  res.status(200).jsonp(req.body);
                }
              });
            } else {
              res.status(404).json({ error: 'Usuario no encontrado' });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Error al buscar el usuario' });
          });
      }



function generarToken() {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
  }


//   router.get('/getUserByEmailToken/:id', (req, res) => {
//     const id = req.params.id;
    
//     User.findById(id)
//       .then(user => {
//         if (user) {
//           // Se encontró el usuario por su id
//           res.json({ email: user.email });
//         } else {
//           // No se encontró ningún usuario con el id proporcionado
//           res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//       })
//       .catch(error => {
//         // Ocurrió un error durante la búsqueda del usuario
//         res.status(500).json({ error: 'Error al buscar el usuario' });
//       });
//   });
  

module.exports = {
    enviarCorreoCambioContrasena
}