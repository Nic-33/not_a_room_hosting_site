'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(
        models.User, {
        foreignKey: "userId",
        onDelete: 'CASCADE',
        hooks: true
      }
      )
      Bookings.belongsTo(
        models.Spots, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      }
      )
    }
  }
  Bookings.init(
    {
      userId: {
        type: DataTypes.INTEGER,
      },

      spotId: {
        type: DataTypes.INTEGER,
      },
      startDate: {
        type: DataTypes.DATE,
        validate: {
          isNull: false,
          isDate: true,
          laterThenToday(value) {
            if (new Date(value) < new Date()) {
              throw new Error("Date must be after today's date.")
            }
          }
        }
      },
      endDate: {
        type: DataTypes.DATE,
        validate: {
          isNull: false,
          isDate: true,
        }
      },
    },
    {
      sequelize,
      modelName: 'Bookings',
      validate: {
        startDateAfterEndDate() {
          if (this.startDate.isAfter(this.endDate)) {
            throw new Error('End date must be after start date.');
          }
        }
      }
    });
  return Bookings;
};
