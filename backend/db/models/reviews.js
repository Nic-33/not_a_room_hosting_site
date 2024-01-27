'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reviews.belongsTo(
        models.User, {
        foreignKey: 'userId',
        hooks: true
      }
      )
      Reviews.hasMany(
        models.Spots, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      }
      )
    }
  }
  Reviews.init({
    userId: {
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER
    },
    review: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        isNull: false,
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};
