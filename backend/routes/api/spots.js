const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages, Bookings } = require('../../db/models')

const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model, Op } = require('sequelize');
const { contentSecurityPolicy } = require('helmet');

const router = express.Router();

const paramsValidation = [
    query('page')
        .default(1)
        .isInt({ min: 1, max: 10 })
        .withMessage("Page must be greater than or equal to 1"),
    query('size')
        .default(20)
        .isInt({ min: 1, max: 20 })
        .withMessage("Size must be greater than or equal to 1"),
    query('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Maximum latitude is invalid"),
    query('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Minimum latitude is invalid"),
    query('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Maximum longitude is invalid"),
    query('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Minimum longitude is invalid"),
    query('minPrice')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    query('maxPrice')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    handleValidationErrors
]

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
    check('lat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('latitude is not valid'),
    check('lng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less the 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isInt({ min: 0 })
        .withMessage('Price must be a positive number')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const reviewValidation = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review Text is Required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

const bookingValidation = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isDate(),
    check('endDate')
        .exists({ checkFalsy: true })
        .isDate()
]

router.delete(
    '/:spotId',
    requireAuth,
    async (req, res, next) => {
        const { spotId } = req.params
        const deleteSpot = await Spots.findByPk(spotId)
        const { user } = req
        const userId = user.id

        if (deleteSpot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        if (deleteSpot.ownerId !== userId) {
            const err = new Error("Forbidden")
            err.status = 403
            return next(err)
        }
        await deleteSpot.destroy()

        res.status(200)
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
            ownerId: user.id,
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price,
        })
        // console.log('newspot:', newSpot)
        await newSpot.save()
        res.status(201)
        res.json(newSpot)
    }
)

router.post(
    '/:spotId/bookings',
    requireAuth,

    async (req, res, next) => {
        const { user } = req
        const { spotId } = req.params
        const { startDate, endDate } = req.body
        let newBooking

        if (new Date(startDate) >= new Date(endDate)) {
            const err = new Error("endDate cannot be on or before startDate")
            err.status = 404
            return next(err)
        }

        const spotDetails = await Spots.findByPk(spotId)
        if (spotDetails === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        const spotBookings = await Bookings.findAll({
            where: {
                spotId: spotId
            },
            attributes: [
                'startDate',
                'endDate'
            ]
        })

        for (let i = 0; i < spotBookings.length; i++) {
            const ele = spotBookings[i];
            let bookingStartDate = new Date(ele.startDate)
            let bookingEndDate = new Date(ele.endDate)
            let newBookingStartDate = new Date(startDate)
            let newBookingEndDate = new Date(endDate)

            if (newBookingStartDate < bookingStartDate && newBookingEndDate > bookingEndDate ||
                newBookingStartDate > bookingStartDate && newBookingEndDate < bookingEndDate) {
                const err = new Error("Sorry, this spot is already booked for the specified dates")
                err.errors = {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
                err.status = 403
                return next(err)
            }

            if (newBookingStartDate >= bookingStartDate && newBookingStartDate <= bookingEndDate) {
                const err = new Error("Sorry, this spot is already booked for the specified dates")
                err.errors = { startDate: "Start date conflicts with an existing booking" }
                err.status = 403
                return next(err)
            }

            if (newBookingEndDate >= bookingStartDate && newBookingEndDate <= bookingEndDate) {
                const err = new Error("Sorry, this spot is already booked for the specified dates")
                err.errors = { endDate: "End date conflicts with an existing booking" }
                err.status = 403
                return next(err)
            }


        }
        // console.log(spotBookings)

        if (user.id !== spotDetails.ownerId) {
            newBooking = await Bookings.create({
                spotId: parseInt(spotId),
                userId: user.id,
                startDate: startDate,
                endDate: endDate
            })
            await newBooking.save()
        } else {
            const err = new Error("you already own this silly")
            err.status = 400
            return next(err)
        }

        res.json(newBooking)
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

        const userReviews = await Reviews.findAll({ where: { userId: user.id, spotId: spotId } })
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
            spotId: parseInt(spotId),
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

        const userId = user.id
        // console.log(userId)

        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }
        if (spot.ownerId !== userId) {
            // console.log(`${spot.ownerId} should not equal ${user.Id}`)
            const err = new Error("Forbidden")
            err.status = 403
            return next(err)
        }
        console.log(`${spot.ownerId} should equal ${user.Id}`)

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
        const updateSpot = await Spots.unscoped().findByPk(spotId)
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        if (updateSpot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        const { user } = req
        const userId = user.id
        if (updateSpot.ownerId !== userId) {
            const err = new Error("Forbidden")
            err.status = 403
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
            price: price,
        })

        await updateSpot.save()
        res.status(200)
        res.json(updateSpot)
    }
)

router.get(
    '/',
    paramsValidation,
    async (req, res) => {
        const infoSpots = {}

        let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

        let query = {
            where: {},
            include: [],
        }

        const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
        const size = req.query.size === undefined ? 20 : parseInt(req.query.size);
        if ((page >= 1 && page <= 10) && (size >= 1 && size <= 20)) {
            query.limit = size;
            query.offset = size * (page - 1);
        }

        if (minLat && maxLat) {
            query.where.lat = { [Op.gte]: minLat, [Op.lte]: maxLat }
        } else {
            if (minLat) { query.where.lat = { [Op.gte]: minLat } }
            if (maxLat) { query.where.lat = { [Op.lte]: maxLat } }
        }

        if (minLng && maxLng) {
            query.where.lng = { [Op.gte]: minLng, [Op.lte]: maxLng }
        } else {
            if (minLng) { query.where.lng = { [Op.gte]: minLng } }
            if (maxLng) { query.where.lng = { [Op.lte]: maxLng } }
        }

        if (minPrice && maxPrice) {
            query.where.price = { [Op.gte]: minPrice, [Op.lte]: maxPrice }
        } else {
            if (minPrice) { query.where.Price = { [Op.gte]: minPrice } }
            if (maxPrice) { query.where.Price = { [Op.lte]: maxPrice } }
        }

        const spots = await Spots.unscoped().findAll(query)
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
                },
                attributes: ['url']
            })
            if (preImage.length > 0) {
                ele.dataValues.previewImage = preImage[0].url
            }
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
        const userSpots = await Spots.unscoped().findAll({
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
            if (preImage.length > 0) {
                ele.dataValues.previewImage = preImage[0].url
            }
            // console.log('ele:', ele)
            userSpots[i] = ele

        }

        infoSpots.Spots = userSpots
        res.json(infoSpots)
    }

)

router.get(
    '/:spotId/bookings',
    requireAuth,
    async (req, res, next) => {
        const { spotId } = req.params
        const { user } = req
        const responseBooking = { Bookings: [] }

        const spotDetails = await Spots.findByPk(spotId)

        if (spotDetails === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }

        const spotBookings = await Bookings.findAll({
            where: {
                spotId: spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
        })
        console.log('sb:', spotBookings)
        if (spotDetails.ownerId === user.id) {
            for (let i = 0; i < spotBookings.length; i++) {
                const ele = spotBookings[i];
                responseBooking.Bookings.push({
                    User: ele.User,
                    id: ele.id,
                    spotId: ele.spotId,
                    userId: ele.userId,
                    startDate: ele.startDate,
                    endDate: ele.endDate,
                    createdAt: ele.createdAt,
                    updatedAt: ele.updatedAt
                })
            }

        } else {
            for (let i = 0; i < spotBookings.length; i++) {
                const ele = spotBookings[i];
                responseBooking.Bookings.push({
                    spotId: ele.spotId,
                    startDate: ele.startDate,
                    endDate: ele.endDate
                })
            }
        }
        // console.log(spotDetails)

        res.json(responseBooking)
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
        // console.log('Sr:', spotReviews)
        const spot = await Spots.findOne({ where: { id: spotId } })
        if (spot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            return next(err)
        }
        for (let i = 0; i < spotReviews.length; i++) {
            const ele = spotReviews[i];
            // console.log(ele)
            const reviewUser = await User.findByPk(ele.userId, {
                attributes: ['id', 'firstName', 'lastName']
            })
            const reviewImage = await ReviewImages.findAll({
                where: {
                    reviewId: ele.id
                },
                attributes: ['id', 'url']
            })

            console.log(reviewImage)

            ele.dataValues.User = reviewUser
            if (reviewImage !== null) {
                ele.dataValues.ReviewImages = reviewImage
            }// console.log('ele:', ele)
            spotResponse.Review.push(ele)
        }
        res.json(spotResponse)
    }
)

router.get(
    '/:spotId',
    async (req, res, next) => {
        const { spotId } = req.params
        const spot = await Spots.unscoped().findByPk(spotId, {
            include: {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },
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

        const responseSpot = {
            id: spotId,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: totalReviews.count,
            avgStarRating: reviewRating,
            SpotImages: spotIm,
            Owner: spot.Owner
        }

        res.json(responseSpot)
    }
)


module.exports = router;
