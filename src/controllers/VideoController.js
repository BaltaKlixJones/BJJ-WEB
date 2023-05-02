const { Video } = require("../db.js");

const getVideoController = async () => {
  const video = await Video.findAll();
  return video;
};

const postVideoController = async (video, title, thumbnail,category) => {
  if (!title || !video || !category) {
    throw Error("Missing data");
  }
  const newVideo = await Video.create({
    video,
    title,
    thumbnail,
    category,
  });
  return newVideo;
};


const putVideoController = async (id, { thumbnail, title, video, category, }, res) => {
  const videoUpdate = await Video.findByPk(id);
  !videoUpdate
    ? res.status(400).json({ error: "Video not found" })
    : videoUpdate.update({
        video,
        title,
        thumbnail,
        category,
      });
  return videoUpdate;
};

const deleteVideoController = async (id) => {
  const videoDelete = await Video.findByPk(id);
  if (!videoDelete) {
    return res.status(400).json({ error: "Video not found" });
  }
  return videoDelete.destroy();
};

module.exports = {
  getVideoController,
  postVideoController,
  putVideoController,
  deleteVideoController,
};
