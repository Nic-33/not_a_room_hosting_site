const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model } = require('sequelize');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req
        const reviewResponse = {}
        const userReviews = await Reviews.findAll({
            where: {
                userId: user.id
            }
        })
        const reviewUser = await User.findByPk(user.id)
        for (let i = 0; i < userReviews.length; i++) {
            const ele = userReviews[i];
            const reviewSpot = await Spots.findByPk(ele.spotId)
            const reviewImage = await ReviewImages.findByPk(ele.id)
            ele.dataValues.User = reviewUser
            ele.dataValues.Spot = reviewSpot
            ele.dataValues.ReviewImages = { id: reviewImage.id, url: reviewImage.url }
            // console.log(ele)
            reviewResponse.Review = ele
        }
        // console.log(userReviews)
        res.json(reviewResponse)
    }
)


module.exports = router;
