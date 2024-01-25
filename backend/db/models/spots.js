'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spots.hasOne(
        models.User, {
        foreignKey: 'ownerId',
        hooks: true
      }
      )
    }
  }
  Spots.init({
    ownerId: {
      type: DataTypes.INTEGER
    },

    address: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    city: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    state: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    country: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -90,
        max: 90
      }
    },

    lan: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -180,
        max: 180
      }
    },

    name: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    description: {
      type: DataTypes.STRING,
      validate: {
        isNull: false
      }
    },

    price: {
      type: DataTypes.INTEGER,
      validate: {
        isNull: false
      }
    }

  },
    {
      sequelize,
      validate: {
        bothCoordsOrNone() {
          if ((this.latitude === null) !== (this.longitude === null)) {
            throw new Error('Either both latitude and longitude, or neither!');
          }
        },
        modelName: 'Spots',
      }
    }
  );
  return Spots;
};
