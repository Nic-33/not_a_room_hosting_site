const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages, Bookings } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model, Op } = require('sequelize');


const router = express.Router();

router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const { user } = req
        const { bookingId } = req.params

        const deleteBooking = await Bookings.findByPk(bookingId)

        if (deleteBooking.userId !== user.id) {
            const err = new Error("you do not own the booking")
            err.status = 400
            return next(err)
        }

        if (deleteBooking === null) {
            const err = new Error("Booking couldn't be found")
            err.status = 404
            return next(err)
        }

        if (new Date(deleteBooking.startDate) < new Date()) {
            const err = new Error("Bookings that have been started can't be deleted")
            err.status = 403
            return next(err)
        }

        await deleteBooking.destroy()

        res.status(200)
        res.json({ message: 'Successfully deleted' })
    }
)

router.put(
    '/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const { user } = req
        const { bookingId } = req.params
        const { startDate, endDate } = req.body

        const editBooking = await Bookings.findByPk(bookingId)

        if (editBooking === null) {
            const err = new Error("Booking couldn't be found")
            err.status = 404
            return next(err)
        }

        if (new Date(editBooking.endDate) < new Date()) {
            const err = new Error("Past bookings can't be modified")
            err.status = 403
            return next(err)
        }

        if (new Date(startDate) >= new Date(endDate)) {
            const err = new Error('Bad request')
            err.error = "endDate cannot be on or before startDate"
            err.status = 404
            return next(err)
        }

        if (editBooking.userId !== user.id) {
            const err = new Error("you do not own the booking")
            err.status = 400
            return next(err)
        }

        const spotBookings = await Bookings.findAll({
            where: {
                spotId: editBooking.spotId,
                [Op.not]: [{ id: bookingId }]
            },
            attributes: [
                'startDate',
                'endDate'
            ]
        })
        // console.log(spotBookings)

        spotBookings.forEach(ele => {
            let bookingStartDate = new Date(ele.startDate)
            let bookingEndDate = new Date(ele.endDate)
            let newBookingStartDate = new Date(startDate)
            let newBookingEndDate = new Date(endDate)
            if (newBookingStartDate <= bookingStartDate && newBookingEndDate >= bookingStartDate ||
                newBookingStartDate <= bookingEndDate && newBookingEndDate >= bookingEndDate) {
                const err = new Error("confilict in booking")
                err.status = 403
                return next(err)
            }
        });

        editBooking.set({
            startDate: startDate,
            endDate: endDate
        })

        await editBooking.save()
        res.json(editBooking)
    }
)

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const responseBooking = { Bookings: [] }

        const { user } = req
        // console.log(user)
        const userBookings = await Bookings.findAll({
            where: {
                userId: user.id
            },
            include: [{
                model: Spots,
            }]
        })
        for (let i = 0; i < userBookings.length; i++) {
            const ele = userBookings[i];

            const spotPreview = await SpotImages.findOne({
                attributes: [
                    'url'
                ],
                where: {
                    spotId: ele.spotId,
                    preview: true
                }
            })
            ele.Spot.dataValues.previewImage = spotPreview.url
            // console.log('SI:', ele)
            responseBooking.Bookings.push({
                id: ele.id,
                spotId: ele.spotId,
                Spot: ele.Spot,
                userId: ele.userId,
                startDate: ele.startDate,
                endDate: ele.endDate,
                createdAt: ele.createdAt,
                updatedAt: ele.updatedAt
            })
        }
        // console.log('UB', userBookings)

        res.json(responseBooking)
    }
)


module.exports = router;
