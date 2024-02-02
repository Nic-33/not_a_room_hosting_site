'use strict';

const { ReviewImages } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImages.bulkCreate([
      {
        reviewId: 1,
        url: 'https://image1R.jpg',
      },
      {
        reviewId: 2,
        url: 'https://image2R.jpg',
      },
      {
        reviewId: 3,
        url: 'https://image3R.jpg',
      },
      {
        reviewId: 4,
        url: 'https://image4R.jpg',
      },
      {
        reviewId: 1,
        url: 'https://image1.1R.jpg',
      },
      {
        reviewId: 1,
        url: 'https://image1.2R.jpg',
      },
      {
        reviewId: 2,
        url: 'https://image2.1R.jpg',
      },
      {
        reviewId: 3,
        url: 'https://image3.1R.jpg',
      },
      {
        reviewId: 4,
        url: 'https://image4.1R.jpg',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
