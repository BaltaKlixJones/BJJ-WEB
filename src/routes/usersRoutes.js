const {Router } = require("express");
const userRouter = Router();
const {getUserHandler, putUserHandler} = require('../handlers/userHandler.js');

userRouter.get('/', getUserHandler);
userRouter.put('/:id', putUserHandler);

module.exports = userRouter;
