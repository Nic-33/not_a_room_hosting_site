const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
    '/',
    async (req, res) => {
        const spots = await Spots.findAll()
        res.json(spots)
    }
)


module.exports = router;
