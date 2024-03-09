import { csrfFetch } from "./csrf"


const GET_REVIEW_FOR_SPOT = 'review/getReviewForSpot'
const GET_REVIEW_FOR_USER = 'review/getReviewForUser'

export const loadReview = review => ({
    type: GET_REVIEW_FOR_SPOT,
    review
})

export const userReview = review => ({
    type: GET_REVIEW_FOR_USER,
    review
})

export const getReview = (spotId) => async dispatch => {
    console.log('review spot id:', spotId)
    const response = await fetch(`/api/spots/${spotId}/reviews`)
    // console.log("this is the response:", response)
    if (response.ok) {
        const review = await response.json()
        console.log("this is the reviews in the if block:", review)
        dispatch(loadReview(review.Review))
        return review
    }
}

export const getUserReview = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')
    if (response.ok) {
        const review = await response.json()
        console.log("this is the reviews in the if block:", review)
        dispatch(loadReview(review.Review))
        return review
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEW_FOR_SPOT: {
            const newState = {};
            console.log('action review:', newState)
            action.review.forEach(review => (newState[review.id] = review))
            return newState;
        }
        case GET_REVIEW_FOR_USER: {
            const newState = {};
            console.log('action review:', newState)
            action.review.forEach(review => (newState[review.id] = review))
            return newState;
        }
        default:
            return state
    }
}

export const deleteReview  = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch(deleteReview());
    return response;
};

export default reviewReducer
