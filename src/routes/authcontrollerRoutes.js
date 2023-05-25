const { Router } = require("express");

const {
    enviarCorreoCambioContrasena,
    getIdByEmail
} = require("../authController/authcontroller")

const changePassword = Router();

changePassword.post("/", enviarCorreoCambioContrasena);
changePassword.get("/:id", enviarCorreoCambioContrasena);

// changePassword.post("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const id2 = await getIdByEmail(id);
//         enviarCorreoCambioContrasena(req, res, id);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener el ID del usuario' });
//     }
// });

module.exports = changePassword;

