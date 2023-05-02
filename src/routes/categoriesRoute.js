const { Router } = require("express");
const {
    getCategoriesHandler,
    postCategoriesHandler,
    putCategoriesHandler,
    deleteCategoriesHandler
} = require("../handlers/CategHandler");
const categorieRouter = Router();


// Blog routes
categorieRouter.get("/", getCategoriesHandler);
categorieRouter.post("/", postCategoriesHandler);
categorieRouter.put("/:id", putCategoriesHandler);
categorieRouter.delete("/:id", deleteCategoriesHandler);

module.exports = categorieRouter;