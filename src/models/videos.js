const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
      "Video",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        video: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumbnail: {
          type: DataTypes.STRING,
          
        },
        category : {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      { timestamps: false }
    );
}