const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
      "Blog",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "https://elimpact.io/sites/default/files/default_images/default_0.png"
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date : {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
      },
      { timestamps: false }
    );
}