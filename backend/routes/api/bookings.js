const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model } = require('sequelize');
const spots = require('../../db/models/spots');

const router = express.Router();




module.exports = router;
