const { Video } = require("../db.js");
const { Categories } = require('../db.js');

const getVideoController = async () => {
 
  const video = await Video.findAll({
    include: [{
      model: Categories,
      attributes: ['name']
    }]
  });
  return video;
};

const getVideosByCategoryId = async (categoryId) => {
  const videos = await Video.findAll({
    include: {
      model: Categories,
      where: { id: categoryId }
    }
  });
  return videos;
};




const postVideoController = async (video, title, thumbnail, category, date) => {
  if (!title || !video || !category) {
    throw Error("Missing data");
  }

  // Busca si existe una categoría con el nombre proporcionado
  let categorias = await Categories.findOne({
    where: {
      name: category
    }
  });

  // Si la categoría no existe, crea una nueva instancia de Categories
  if (!categorias) {
    categorias = await Categories.create({ name: category });
  }

  const obj = {
    title,
    video,
    thumbnail,
    category: categorias.id, // Asigna el ID de la categoría
    date,
  };

  const newVideo = await Video.create(obj);
  await newVideo.setCategory(categorias);

  return newVideo;
};

// const putVideoController = async (id, {title, video, thumbnail, category, date}, res) => {
//   const videoUpdate = await Video.findByPk(id, { include: [Categories] });
//   if (!videoUpdate) {
//     res.status(400).json({ error: "Video not found" });
//   } else {
//     let categorias = await Categories.findOne({ where: { name: category } });
//     if (!categorias) {
//       categorias = await Categories.create({ name: category });
//     }
//     await videoUpdate.setCategory(categorias);
//     await videoUpdate.update({
//       title,
//       video,
//       thumbnail,
//       category: categorias.name,
//       date
//     });
//     return videoUpdate;
//   }
// };

const putVideoController = async (id, { title, video, thumbnail, category, date }, res) => {
  try {
    const videoUpdate = await Video.findByPk(id, { include: [Categories] });
    if (!videoUpdate) {
      res.status(400).json({ error: "Video not found" });
      return;
    }
    
    let categoryInstance;
    if (category) {
      categoryInstance = await Categories.findOrCreate({ where: { name: category } });
    }
    
    await videoUpdate.setCategory(categoryInstance && categoryInstance[0]);
    
    const updatedVideo = await videoUpdate.update({
      title,
      video,
      thumbnail,
      date,
      category,
    }, { include: [Categories] });
    
    res.json(updatedVideo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const putVideoController = async (id, { title, video, thumbnail, category, date }, res) => {
//   try {
//     const videoUpdate = await Video.findByPk(id, { include: [Categories] });
//     if (!videoUpdate) {
//       res.status(400).json({ error: "Video not found" });
//       return;
//     }
    
//     let categoryInstance;
//     if (category) {
//       categoryInstance = await Categories.findOrCreate({ where: { name: category } });
//     }
    
//     await videoUpdate.setCategory(categoryInstance && categoryInstance[0]);
    
//     const updatedVideo = await videoUpdate.update({
//       title,
//       video,
//       thumbnail,
//       date
//     }, { include: [Categories] });
    
//     const response = {
//       id: updatedVideo.id,
//       title: updatedVideo.title,
//       video: updatedVideo.video,
//       thumbnail: updatedVideo.thumbnail,
//       category: updatedVideo.category,
//       date: updatedVideo.date,
//       Category: {
//         name: categoryInstance ? categoryInstance.name : ""
//       }
//     };

//     res.json(response);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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
  getVideosByCategoryId
};
