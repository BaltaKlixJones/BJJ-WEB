const {User} = require('../db');

const getUserController = async () => {
    const user = await User.findAll();
    return user;
  };


  const deleteUserController = async (id) => {
    const userDelete = await User.findByPk(id);
    if (!userDelete) {
      return res.status(400).json({ error: "User not found" });
    }
    return userDelete.destroy();
  }

  const putUserController = async (
    id,
    { email, password, status },
    res
  ) => {
    const userUpdate = await User.findByPk(id);
    !userUpdate
      ? res.status(400).json({ error: "User not found" })
      : userUpdate.update({
        email,
        password,
        status,
        });
    return userUpdate;
  };


module.exports = {
    getUserController,
    putUserController,
    deleteUserController
}