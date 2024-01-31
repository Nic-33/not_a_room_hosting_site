const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model } = require('sequelize');
const spots = require('../../db/models/spots');
const { contentSecurityPolicy } = require('helmet');

const router = express.Router();

const spotValidation = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    //need to figure out what the properties needs to be
    // check('lat')

    //     .withMessage('latitude is not valid'),
    // check('lng')
    //     .withMessage('longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less the 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const reviewValidation = [
    check('review')
        // need to fix review Validation
        .exists({ checkFalsy: true })
        .withMessage("Review Text is Required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .isLength({ max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors

]

//needs work - has issues with Foriegn key
router.delete(
    '/:spotId',
    requireAuth,
    async (req, res) => {
        const { spotId } = req.params
        const deleteSpot = await Spots.findByPk(spotId)
        await deleteSpot.destroy()
        res.statusCode(200)
        res.json({ message: 'Successfully deleted' })
    }
)

router.post(
    '/',
    requireAuth,
    spotValidation,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const { user } = req
        // console.log(address)
        const newSpot = await Spots.create({
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price,
            ownerId: user.id
        })
        // console.log('newspot:', newSpot)
        await newSpot.save()
        res.status(201)
        res.json(newSpot)
    }
)

router.post(
    '/:spotId/reviews',
    requireAuth,
    reviewValidation,
    async (req, res, next) => {
        const { user } = req
        const { spotId } = req.params
        const { review, stars } = req.body

        const userReviews = await Reviews.findAll({ where: { userId: user.id } })
        // console.log(userReviews.length)
        if (userReviews.length > 0) {
            const err = new Error("User already has a review for this spot")
            err.status = 500
            return next(err)
        }
        const spot = await Spots.findOne({ where: { id: spotId } })
        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        const newReview = await Reviews.create({
            userId: user.id,
            spotId: spotId,
            review: review,
            stars: stars
        })

        await newReview.save()
        res.status(201)
        res.json(newReview)
    }
)

router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res, next) => {
        const { url, preview } = req.body
        const { user } = req
        const { spotId } = req.params
        const response = {}

        const spot = await Spots.findByPk(spotId)
        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        const newSpotImage = await SpotImages.create({
            spotId: spotId,
            url: url,
            preview: preview
        })
        await newSpotImage.save()

        response.id = newSpotImage.id
        response.url = newSpotImage.url
        response.preview = newSpotImage.preview
        res.status(200)
        res.json(response)
    }
)



router.put(
    '/:spotId',
    requireAuth,
    spotValidation,
    async (req, res, next) => {
        const { spotId } = req.params
        const updateSpot = await Spots.findByPk(spotId)
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        if (updateSpot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        updateSpot.set({
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })

        await updateSpot.save()

        res.status(200)
        res.json(updateSpot)
    }
)

router.get(
    '/',
    async (req, res) => {
        let infoSpots = {}
        const spots = await Spots.findAll()
        for (let i = 0; i < spots.length; i++) {
            const ele = spots[i];
            // console.log(spots)
            let reviewRating = await Reviews.sum('stars', {
                where: {
                    spotId: ele.id
                }
            })
            // console.log("reviewRating ", reviewRating)
            if (reviewRating !== null) {
                let totalReviews = await Reviews.findAndCountAll({
                    where: {
                        spotId: ele.id
                    }
                })
                // console.log(reviewRating)
                // console.log(totalReviews)
                reviewRating = reviewRating / totalReviews.count

            }
            ele.dataValues.avgRating = reviewRating
            // console.log(ele)
            spots[i] = ele
            let preImage = await SpotImages.findAll({
                where: {
                    spotId: ele.id,
                    preview: true
                }
            })
            // console.log("PVI:", preImage[0].url)
            ele.dataValues.previewImage = preImage[0].url
            // console.log('ele:', ele)
        }

        infoSpots.Spots = spots
        res.json(infoSpots)
    }
)

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req
        // console.log(user)
        let infoSpots = {}
        const userSpots = await Spots.findAll({
            where: {
                ownerId: user.id
            }
        })
        for (let i = 0; i < userSpots.length; i++) {
            const ele = userSpots[i];
            // console.log(spots)
            let reviewRating = await Reviews.sum('stars', {
                where: {
                    spotId: ele.id
                }
            })
            // console.log("reviewRating ", reviewRating)
            if (reviewRating !== null) {
                let totalReviews = await Reviews.findAndCountAll({
                    where: {
                        spotId: ele.id
                    }
                })
                // console.log(reviewRating)
                // console.log(totalReviews)
                reviewRating = reviewRating / totalReviews.count

            }
            ele.dataValues.avgRating = reviewRating
            // console.log(ele)
            userSpots[i] = ele
            let preImage = await SpotImages.findAll({
                attributes: [
                    'url'
                ],
                where: {
                    spotId: ele.id,
                    preview: true
                }
            })

            // console.log("PVI:", preImage)
            ele.dataValues.previewImage = preImage[0].url
            console.log('ele:', ele)
            userSpots[i] = ele

        }

        infoSpots.Spots = userSpots
        res.json(infoSpots)
    }

)

router.get(
    '/:spotId/reviews',
    async (req, res, next) => {
        const { spotId } = req.params
        const spotResponse = { Review: [] }
        const spotReviews = await Reviews.findAll({
            where: {
                spotId: spotId
            }
        })
        console.log('Sr:', spotReviews)
        const spot = await Spots.findOne({ where: { id: spotId } })
        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }
        for (let i = 0; i < spotReviews.length; i++) {
            const ele = spotReviews[i];
            const reviewUser = await User.findByPk(ele.userId)
            const reviewImage = await ReviewImages.findByPk(ele.id)
            ele.dataValues.User = reviewUser
            ele.dataValues.ReviewImages = { id: reviewImage.id, url: reviewImage.url }
            // console.log('ele:', ele)
            spotResponse.Review[i] = ele
        }
        res.json(spotResponse)
    }
)

router.get(
    '/:spotId',
    async (req, res, next) => {
        const { spotId } = req.params
        const spot = await Spots.findByPk(spotId, {
            include: {
                model: User,
                as: 'Owner'
            }
        })
        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }
        const spotIm = await SpotImages.findAll({
            attributes: ['id', 'url', 'preview'],
            where: { spotId: spotId }
        })
        spot.dataValues.SpotImages = spotIm
        let reviewRating = await Reviews.sum('stars', {
            where: {
                spotId: spotId
            }
        })
        let totalReviews = await Reviews.findAndCountAll({
            where: {
                spotId: spotId
            }
        })
        reviewRating = reviewRating / totalReviews.count
        spot.dataValues.avgStarRating = reviewRating
        spot.dataValues.numReviews = totalReviews.count
        res.json(spot)
    }
)


module.exports = router;
