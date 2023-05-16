const { Router } = require("express");
const {
    getVideoHandler,
    postVideoHandler,
    putVideoHandler,
    deleteVideoHandler,
    getVideosByCategoryIdHandler
} = require("../handlers/videoHandler");
const videorouter = Router();


// Blog routes
videorouter.get("/", getVideoHandler);
videorouter.get('/category/:id', getVideosByCategoryIdHandler);
videorouter.post("/", postVideoHandler);
videorouter.put("/:id", putVideoHandler);
videorouter.delete("/:id", deleteVideoHandler);

module.exports = videorouter;