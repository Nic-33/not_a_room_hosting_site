const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model } = require('sequelize');

const router = express.Router();

const reviewValidation = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review Text is Required"),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .exists({ checkFalsy: true })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

//needs work - has issues with foreign key
router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res, next) => {
        const { reviewId } = req.params
        const deleteReview = await Reviews.findByPk(reviewId)

        // console.log(deleteReview)
        if (deleteReview === null) {
            const err = new Error("review couldn't be found")
            err.status = 404
            return next(err)
        }

        const { user } = req
        if (deleteReview.userId !== user.Id) {
            const err = new Error("Forbidden")
            err.status = 403
            return next(err)
        }

        await deleteReview.destroy()

        res.status(200)
        res.json({ message: 'successfully deleted' })
    }
)

router.put(
    '/:reviewId',
    requireAuth,
    reviewValidation,
    async (req, res, next) => {
        const { reviewId } = req.params
        const { review, stars } = req.body

        const updateReview = await Reviews.findByPk(reviewId)

        if (updateReview === null) {
            const err = new Error("review couldn't be found")
            err.status = 404
            return next(err)
        }

        const { user } = req
        if (updateReview.userId !== user.Id) {
            const err = new Error("Forbidden")
            err.status = 403
            return next(err)
        }

        updateReview.set({
            review: review,
            stars: stars
        })

        await updateReview.save()

        res.status(200)
        res.json(updateReview)
    }
)

router.post(
    '/:reviewId/Images',
    requireAuth,
    async (req, res, next) => {
        const { reviewId } = req.params
        const { url } = req.body
        const newReviewResponse = {}

        const reviewExists = await Reviews.findByPk(reviewId)
        if (reviewExists === null) {
            const err = new Error("Review couldn't be found")
            err.status = 404
            return next(err)
        }

        const { user } = req
        if (reviewExists.userId !== user.Id) {
            const err = new Error("Forbidden")
            err.status = 403
            return next(err)
        }

        const numberImages = await ReviewImages.count({
            where: {
                reviewId: reviewId
            }
        })
        console.log('# of images:', numberImages)
        if (numberImages > 10) {
            const err = new Error("Maximum number of images for this resource was reached")
            err.status = 403
            return next(err)
        }

        const newReviewImage = await ReviewImages.create({
            reviewId: reviewId,
            url: url
        })
        await newReviewImage.save()
        newReviewResponse.Id = newReviewImage.id
        newReviewResponse.url = url
        res.status(200)
        res.json(newReviewResponse)
    }
)

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
        const reviewUser = await User.findByPk(user.id, {
            attributes: ['id', 'firstName', 'lastName']
        })
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
