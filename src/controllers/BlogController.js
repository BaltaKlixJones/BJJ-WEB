const { Blog } = require("../db.js");

const getBlogController = async () => {
  const blog = await Blog.findAll();
  return blog;
};

const postBlogController = async (title, image) => {
  if (!title || !image) {
    throw Error("Missing data");
  }
  const blog = await Blog.create({
    image,
    title,
  });
  return blog;
};

const putBlogController = async (
    id,
    { image, title },
    res
  ) => {
    const blogUpdate = await Blog.findByPk(id);
    !blogUpdate
      ? res.status(400).json({ error: "Blog not found" })
      : blogUpdate.update({
          image,
          title,
        });
    return blogUpdate;
  };


const deleteBlogController = async (id) => {
    const blogDelete = await Blog.findByPk(id);
    if (!blogDelete) {
      return res.status(400).json({ error: "Post not found" });
    }
    return blogDelete.destroy();
  };


module.exports = {
    getBlogController,
    postBlogController,
    putBlogController,
    deleteBlogController
};