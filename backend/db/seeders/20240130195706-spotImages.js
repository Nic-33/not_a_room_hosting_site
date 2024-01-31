'use strict';

const { SpotImages } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImages.bulkCreate([
      {
        spotId: 1,
        url: 'https://image1P.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://image2P.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://image3P.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://image4P.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://image1.1.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://image1.2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://image2.1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://image3.1.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://image4.1.jpg',
        preview: false
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
