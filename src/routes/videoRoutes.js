const { Router } = require("express");
const {
    getVideoHandler,
    postVideoHandler,
    putVideoHandler,
    deleteVideoHandler
} = require("../handlers/videoHandler");
const videorouter = Router();


// Blog routes
videorouter.get("/", getVideoHandler);
videorouter.post("/", postVideoHandler);
videorouter.put("/:id", putVideoHandler);
videorouter.delete("/:id", deleteVideoHandler);

module.exports = videorouter;