const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { Spots, Reviews, SpotImages, User, ReviewImages, Bookings } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');
const { Model } = require('sequelize');
const { contentSecurityPolicy } = require('helmet');

const router = express.Router();

router.delete(
    '/:imageId',
    requireAuth,
    async (req, res, next) => {
        const { user } = req
        const { imageId } = req.params

        const deleteImage = await SpotImages.findByPk(imageId, {
            include: [{
                model: Spots
            }]
        })
        // console.log(deleteImage)

        if (deleteImage === null) {
            const err = new Error("Spot Image couldn't be found")
            err.status = 404
            return next(err)
        }

        if (user.id !== deleteImage.Spot.ownerId) {
            const err = new Error()
            err.status = 403
            return next(err)
        }

        await deleteImage.destroy()

        res.json({ message: 'Successfully deleted' })
    }
)

module.exports = router;
