const { Router } = require("express");

const {
    enviarCorreoCambioContrasena,
} = require("../authController/authcontroller")

const changePassword = Router();

changePassword.post("/", enviarCorreoCambioContrasena);
changePassword.get("/:id", enviarCorreoCambioContrasena);



module.exports = changePassword;

