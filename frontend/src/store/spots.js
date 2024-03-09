import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/getAllSpots'
const CREATE_SPOT = 'spots/createSpot'
const DELETE_SPOT = 'spots/deleteSpot'

const loadSpots = spots => ({
    type: GET_ALL_SPOTS,
    spots
})

const CreateSPOT = spots => ({
    type: CREATE_SPOT,
    spots
})

const DeleteSpot = () => ({
    type: DELETE_SPOT,
})

export const getSpots = () => async dispatch => {
    const response = await fetch('/api/spots')
    // console.log("this is the response:", response)
    if (response.ok) {
        const spots = await response.json()
        console.log("this is the spots in the if block:", spots)
        dispatch(loadSpots(spots.Spots))
    }
}

export const createSpot = (payload) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const spot = await res.json()
        dispatch(CreateSPOT(spot))
    }
}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const allSpots = { ...state }
            console.log('action spot:', action)
            action.spots.forEach(spot => (allSpots[spot.id] = spot));
            return allSpots
        }
        case CREATE_SPOT: {
            return {
                ...state,
                [action.spots.Id]: {
                    ...state[action.spots.Id],
                    spots: [...state[action.spots.Id].spots, action.spots.id]
                }
            }
        }
        default:
            return state
    }
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    dispatch(deleteSpot());
    return response;
};

export default spotsReducer
