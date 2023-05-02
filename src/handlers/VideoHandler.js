const {
    getVideoController,
    postVideoController,
    putVideoController,
    deleteVideoController
  } = require("../controllers/videoController.js");
  
  const getVideoHandler = async (req, res) => {
    try {
      const video = await getVideoController();
      video.length === 0
        ? res.status(400).send("No hay Posteos")
        : res.status(200).json(video);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const postVideoHandler = async (req, res) => {
    const { title, video, thumbnail, category } = req.body;
  
    try {
      const newVideo = await postVideoController(title, video, thumbnail, category);
      !newVideo
        ? res.status(400).json({ error: "POST not created" })
        : res.status(200).json(newVideo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const putVideoHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      await putVideoController(id, req.body);
      return res.status(200).json({ message: "Post updated" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const deleteVideoHandler = async (req, res) => {
      const { id } = req.params;
      try {
        await deleteVideoController(id);
        res.status(200).json({ message: "Video deleted" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  
  module.exports = {
    getVideoHandler,
    postVideoHandler,
    putVideoHandler,
    deleteVideoHandler
  };