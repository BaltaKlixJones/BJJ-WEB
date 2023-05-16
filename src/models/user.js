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
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      subscription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      subscriptionDate: {
        type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW
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