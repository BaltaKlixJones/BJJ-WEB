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
    video,
    title,
    thumbnail,
    category: categorias.id, // Asigna el ID de la categoría
    date,
  };

  console.log(obj)

  const newVideo = await Video.create(obj);
  await newVideo.setCategory(categorias);

  return newVideo;
};
// const postVideoController = async (video, title, thumbnail,category, date) => {
//   if (!title || !video || !category) {
//     throw Error("Missing data");
//   }
  // const newVideo = await Video.create({
  //   video,
  //   title,
  //   thumbnail,
  //   category,
  //   date
  // });
  // return newVideo;

  // const obj = {
  //   video,
  //   title,
  //   thumbnail,
  //   category,
  //   date
  // }
  // const newVideo = await Video.create(obj);

  // const categorias = await Categories.findOne({
  //   where: {
  //     name: category
  //   }
  // })

//   console.log(newVideo.__proto__)
//   await newVideo.createCategory(categorias);

//   return newVideo;


// };


// const putVideoController = async (id, { thumbnail, title, video, category, date}, res) => {
//   const videoUpdate = await Video.findByPk(id);
//   !videoUpdate
//     ? res.status(400).json({ error: "Video not found" })
//     : videoUpdate.update({
//         video,
//         title,
//         thumbnail,
//         category,
//         date
//       });
//   return videoUpdate;
// };

const putVideoController = async (id, { thumbnail, title, video, category, date}, res) => {
  const videoUpdate = await Video.findByPk(id, { include: [Categories] });
  if (!videoUpdate) {
    res.status(400).json({ error: "Video not found" });
  } else {
    let categorias = await Categories.findOne({ where: { name: category } });
    if (!categorias) {
      categorias = await Categories.create({ name: category });
    }
    await videoUpdate.setCategory(categorias);
    await videoUpdate.update({
      video,
      title,
      thumbnail,
      category: categorias.name,
      date
    });
    return videoUpdate;
  }
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
