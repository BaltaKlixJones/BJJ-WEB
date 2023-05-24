const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize) => {
  // defino el modelo
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      subscription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      subscriptionDate: {
        type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
      },
      subscriptionDateEnd : {
       type: DataTypes.DATE,
       allowNull: false,
       defaultValue: DataTypes.NOW,
       get() {
        const subscriptionType = this.subscriptionType; 
    const endDate = new Date(this.subscriptionDate); 

        if (subscriptionType === 1) {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (subscriptionType === 3){
          endDate.setMonth(endDate.getMonth() + 3);
        }
        return endDate;
       },
      },
       subscriptionType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 3]]
        }
       },
    },
    { timestamps: false }
  );

  // encriptar password
  User.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };
  
  // comparar password
  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Exporto el modelo
  return User;
};