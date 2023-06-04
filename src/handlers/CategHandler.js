const {
    getCategoriesController,
    postCategoriesController,
    putCategoriesController,
    deleteCategoriesController
  } = require("../controllers/CategController.js");
  
  const getCategoriesHandler = async (req, res) => {
    try {
      const categorie = await getCategoriesController();
      categorie.length === 0
        ? res.status(400).send("No hay Categorias")
        : res.status(200).json(categorie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const postCategoriesHandler = async (req, res) => {
    const { name } = req.body;
  
    try {
      const newCategory = await postCategoriesController(name);
      !newCategory
        ? res.status(400).json({ error: "POST not created" })
        : res.status(200).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const putCategoriesHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      await putCategoriesController(id, req.body);
      return res.status(200).json({ message: "Post updated" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const deleteCategoriesHandler = async (req, res) => {
      const { id } = req.params;
      try {
        await deleteCategoriesController(id);
        res.status(200).json({ message: "Categorie deleted" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  
  module.exports = {
    getCategoriesHandler,
    postCategoriesHandler,
    putCategoriesHandler,
    deleteCategoriesHandler
  };