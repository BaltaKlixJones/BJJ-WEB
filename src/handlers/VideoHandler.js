const {
    getVideoController,
    postVideoController,
    putVideoController,
    deleteVideoController,
    getVideosByCategoryId
  } = require("../controllers/VideoController.js");
  
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


  const getVideosByCategoryIdHandler = async (req, res) => {
    const categoryId = req.params.id;
    try {
      const videos = await getVideosByCategoryId(categoryId);
      videos.length === 0
        ? res.status(400).send("No hay Posteos")
        : res.status(200).json(videos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  


  const postVideoHandler = async (req, res) => {
    const { title, video, thumbnail, category, date } = req.body;
  
    try {
      const newVideo = await postVideoController(title, video, thumbnail, category, date);
      !newVideo
        ? res.status(400).json({ error: "POST not created" })
        : res.status(200).json(newVideo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  // const putVideoHandler = async (req, res) => {
  //   const {id} = req.params;
  //   const video = req.body;
    
  //   try {
  //     const videoUpdated = await putVideoController(id, video);
  //     if (videoUpdated) {
  //       res.status(200).json(videoUpdated);
  //     } else {
  //       res.status(404).json({ error: "Video not found" });
  //     }
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // };
  const putVideoHandler = async (req, res) => {
    const { id } = req.params;
    const { title, video, thumbnail, category, date } = req.body;
  
    try {
      await putVideoController(id, { title, video, thumbnail, category, date }, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
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
    deleteVideoHandler,
    getVideosByCategoryIdHandler
  };