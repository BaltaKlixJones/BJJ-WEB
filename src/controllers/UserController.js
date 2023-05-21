const {User} = require('../db');
const cron = require("node-cron");
const {Sequelize} = require("sequelize");

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

// Verificar suscripciones
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running cron job");
    const oneMinuteAgo = new Date();
  
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 3);
  
    console.log(oneMinuteAgo)
  
    const usersToUpdate = await User.findAll({
      where: {
        status: "active",
        subscription: true,
        subscriptionDate: {
          [Sequelize.Op.lt]: oneMinuteAgo,
        },
      },
    });
  
    for (const user of usersToUpdate) {
      try {
        if ( user.id == "fc7f972e-6037-431b-8d4d-94daa3b3e4d3" ) {
          continue;
        }
        user.subscription = false;
        await user.save();
        console.log('User saved:', user.id);
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
  });

module.exports = {
    getUserController,
    putUserController,
    deleteUserController
}