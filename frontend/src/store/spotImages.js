import { csrfFetch } from "./csrf"

const CREATE_IMAGES = 'images/createImages'
const UPDATE_IMAGES = 'Images/updateImages'

export const createSpotImages = images => ({
    type: CREATE_IMAGES,
    images
})

export const updateReview = images => ({
    type: UPDATE_IMAGES,
    images
})


export const createNewSpotImages = (payload, spotId) => async dispatch => {
    console.log('image spotID:', spotId)
    console.log('imagepayload:', payload)
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    console.log('if statment res for createSpotImages:', response)
    if (response.ok) {
        const images = await response.json()
        dispatch(createSpotImages(images))
    }
}

// export const updateSpotImages = (payload) => async dispatch => {
//     const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//     })
//     console.log('if statment res for createreview:', response)
//     if (response.ok) {
//         const review = await response.json()
//         dispatch(createReview(review))
//     }
// }
