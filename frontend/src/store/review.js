import { csrfFetch } from "./csrf"


const GET_REVIEW_FOR_SPOT = 'review/getReviewForSpot'
const GET_REVIEW_FOR_USER = 'review/getReviewForUser'
const CREATE_REVIEW = 'review/createReview'
const UPDATE_REVIEW = 'review/updateReview'

export const loadReview = review => ({
    type: GET_REVIEW_FOR_SPOT,
    review
})

export const userReview = review => ({
    type: GET_REVIEW_FOR_USER,
    review
})

export const createReview = review => ({
    type: CREATE_REVIEW,
    review
})

export const updateReview = review => ({
    type: UPDATE_REVIEW,
    review
})





export const getReview = (spotId) => async dispatch => {
    // console.log('review spot id:', spotId)
    const response = await fetch(`/api/spots/${spotId}/reviews`)
    // console.log("this is the response:", response)
    if (response.ok) {
        const review = await response.json()
        // console.log("this is the reviews in the if block:", review)
        dispatch(loadReview(review.Review))
        return review
    }
}

export const getUserReview = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')
    if (response.ok) {
        const review = await response.json()
        // console.log("this is the reviews in the if block:", review)
        dispatch(loadReview(review.Review))
        return review
    }
}

export const createNewReview = (payload, spotId) => async dispatch => {
    // console.log('spotId inside createReiview', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    console.log('if statment res for createreview:', response.status)
    if (response.ok) {
        const review = await response.json()
        console.log('revreev', review)
        dispatch(createReview(review))
    }
}

export const updateReviewInfo = (payload, reviewId) => async dispatch => {
    console.log(reviewId)
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    // console.log('if statment res for createreview:', response.error)
    if (response.ok) {
        const review = await response.json()
        console.log('review', review)
        dispatch(updateReview(review))
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEW_FOR_SPOT: {
            const newState = {};
            // console.log('action review:', newState)
            action.review.forEach(review => (newState[review.id] = review))
            return newState;
        }
        case GET_REVIEW_FOR_USER: {
            const newState = {};
            // console.log('action review:', newState)
            action.review.forEach(review => (newState[review.id] = review))
            return newState;
        }
        case CREATE_REVIEW: {
            console.log('action', action)
            console.log('state', state)
            return {
                ...state,
                [action.review.Id]: {
                    ...state[action.review.Id],
                    review: [...state[action.review.id],action.review]
                }
            }
        }
        case UPDATE_REVIEW: {
            return {
                ...state,
                [action.review.id]: {
                    ...state[action.review.id],
                    ...action.review
                }
            }

        }
        default:
            return state
    }
}

export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch(deleteReview());
    return response;
};

export default reviewReducer
