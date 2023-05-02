const { Categories } = require("../db");

const getCategoriesController = async () => {
  const categories = await Categories.findAll();
  return categories;
};

const postCategoriesController = async (name) => {
  if (!name) {
    throw Error("Missing data");
  }
  const newCategorie = await Categories.create({
    name,
  });
  return newCategorie;
};

const putCategoriesController = async (
    id, { name },
    res
  ) => {
    const categorieUpdate = await Categories.findByPk(id);
    !categorieUpdate
      ? res.status(400).json({ error: "Categorie not found" })
      : categorieUpdate.update({
         name
        });
    return categorieUpdate;
  };


const deleteCategoriesController = async (id) => {
  const categorieDelete = await Categories.findByPk(id);
  if (!categorieDelete) {
    return res.status(400).json({ error: "Post not found" });
  }
  return categorieDelete.destroy();
};

module.exports = {
  getCategoriesController,
  postCategoriesController,
  putCategoriesController,
  deleteCategoriesController
};