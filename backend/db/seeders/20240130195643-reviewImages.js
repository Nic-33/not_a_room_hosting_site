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
        spotId: 1,
        url: 'https://image1R.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://image2R.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://image3R.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://image4R.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://image1.1R.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://image1.2R.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://image2.1R.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://image3.1R.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://image4.1R.jpg',
        preview: false
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
