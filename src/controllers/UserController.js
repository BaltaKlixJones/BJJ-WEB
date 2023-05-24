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

  // const putUserController = async (
  //   id,
  //   { email, password, status },
  //   res
  // ) => {
  //   const userUpdate = await User.findByPk(id);
  //   !userUpdate
  //     ? res.status(400).json({ error: "User not found" })
  //     : userUpdate.update({
  //       email,
  //       password,
  //       status,
  //       });
  //   return userUpdate;
  // };
  const putUserController = async (id, { email, password, status, subscription, subscriptionDate, subscriptionDateEnd, subscriptionType }, res) => {
    const userUpdate = await User.findByPk(id);
    if (!userUpdate) {
      res.status(400).json({ error: "User not found" });
    } else {
      await userUpdate.update({
        email,
        password,
        status,
        subscription,
        subscriptionDate,
        subscriptionDateEnd,
        subscriptionType,
      });
    }
    return userUpdate;
  };

//Verificar suscripciones
  // cron.schedule("*/1 * * * *", async () => {
  //   console.log("Running cron job");
  //   const oneMinuteAgo = new Date();
  
  //   oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 3);
  
  //   console.log(oneMinuteAgo)
  
  //   const usersToUpdate = await User.findAll({
  //     where: {
  //       status: "active",
  //       subscription: true,
  //       subscriptionDate: {
  //         [Sequelize.Op.lt]: oneMinuteAgo,
  //       },
  //     },
  //   });
  
  //   for (const user of usersToUpdate) {
  //     try {
  //       if ( user.email == "balta98_@hotmail.com" ) {
  //         continue;
  //       }
  //       user.subscription = false;
  //       await user.save();
  //       console.log('User saved:', user.id);
  //     } catch (error) {
  //       console.error('Error saving user:', error);
  //     }
  //   }
  // });
  cron.schedule("0 */12 * * *", async () => {
    console.log("Running cron job");
  
    const currentDate = new Date();
  
    const usersToUpdate = await User.findAll({
      where: {
        status: "active",
        subscription: true,
        subscriptionType: 3,
        subscriptionDateEnd: {
          [Sequelize.Op.lt]: currentDate,
        },
      },
    });
  
    for (const user of usersToUpdate) {
      try {
        if (user.email === "balta98_@hotmail.com") {
          continue;
        }
  
        user.subscription = false;
        await user.save();
        console.log("User saved:", user.id);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }
  });


module.exports = {
    getUserController,
    putUserController,
    deleteUserController
}