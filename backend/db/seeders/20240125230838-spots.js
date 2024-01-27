'use strict';

const { Spots } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Spots.bulkCreate([
        {
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123
        },
        {
          ownerId: 3,
          address: "221B Baker St",
          city: "London",
          state: "n/a",
          country: "U.K.",
          name: "Sherlock Holmes apartment",
          description: "sherlock holmes apartment in london",
          price: 222
        },
        {
          ownerId: 2,
          address: "42-2630 Hegal Place",
          city: "Alexandria",
          state: "Virginia",
          country: "United States of America",
          name: "Mulder home",
          description: "The truth is out there",
          price: 168
        },
        {
          ownerId: 2,
          address: "344 Clinton ST, apt 3B",
          city: "Metropolis",
          state: "Kansas",
          country: "United States of America",
          name: "mid city apartment",
          description: "super place to visit",
          price: 249
        },
      ],)
    } catch (err) {
      console.log(err)
      throw Error(err)
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [3, 2, 1] }
    }, {});
  }
};
