const {
    getBlogHandler,
    postBlogHandler,
    putBlogHandler,
    deleteBlogHandler
} = require("../handlers/blogHandler");
const blogrouter = Router();


// Blog routes
blogrouter.get("/", getBlogHandler);
blogrouter.post("/", postBlogHandler);
blogrouter.put("/:id", putBlogHandler);
blogrouter.delete("/:id", deleteBlogHandler);

module.exports = blogrouter;