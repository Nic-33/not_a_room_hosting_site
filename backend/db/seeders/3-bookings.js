'use strict';

const { Bookings } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';     // define table name in options object
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 2,
        startDate: '2024-11-19 00:00:00.000 +00:00',
        endDate: '2024-11-20 00:00:00.000 +00:00'
      },
      {
        userId: 2,
        spotId: 3,
        startDate: '2024-10-19 00:00:00.000 +00:00',
        endDate: '2024-10-26 00:00:00.000 +00:00'
      },
      {
        userId: 3,
        spotId: 4,
        startDate: '2024-03-03 00:00:00.000 +00:00',
        endDate: '2024-03-08 00:00:00.000 +00:00'
      },
      {
        userId: 3,
        spotId: 1,
        startDate: '2024-07-07 00:00:00.000 +00:00',
        endDate: '2024-08-08 00:00:00.000 +00:00'
      },
      {
        userId: 2,
        spotId: 3,
        startDate: '2024-09-02 00:00:00.000 +00:00',
        endDate: '2024-09-20 00:00:00.000 +00:00'
      },
      {
        userId: 1,
        spotId: 1,
        startDate: '2024-01-01 00:00:00.000 +00:00',
        endDate: '2024-02-22 00:00:00.000 +00:00'
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
