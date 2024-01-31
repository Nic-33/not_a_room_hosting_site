'use strict';

const { Reviews } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Reviews.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        review: 'had a Puzzling good time',
        stars: 1
      },
      {
        userId: 2,
        spotId: 2,
        review: 'had a Puzzling good time',
        stars: 3
      },
      {
        userId: 3,
        spotId: 2,
        review: 'had a Puzzling good time',
        stars: 5
      },
      {
        userId: 1,
        spotId: 3,
        review: 'had a Puzzling good time',
        stars: 4
      },
      {
        userId: 2,
        spotId: 4,
        review: 'had a Puzzling good time',
        stars: 3
      },
      {
        userId: 3,
        spotId: 1,
        review: 'review',
        stars: 5
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
