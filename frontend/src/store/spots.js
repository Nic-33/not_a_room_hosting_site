import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/getAllSpots'
const CREATE_SPOT = 'spots/createSpot'
const DELETE_SPOT = 'spots/deleteSpot'
const GET_A_SPOT = 'spots/getASpot'
const UPDATE_SPOT = 'spots/update'

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

const loadASpot = spot => ({
    type: GET_A_SPOT,
    spot
})

const UpdateSpot = spot => ({
    type: UPDATE_SPOT,
    spot
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
        const spots = await res.json()
        console.log('res:', spots)
        dispatch(CreateSPOT(spots))
        return spots
    }
}

export const getSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    if (res.ok) {
        const spots = await res.json()
        console.log("this is the single spot in the if block:", spots)
        dispatch(loadASpot(spots))
    }
}

export const updateSpot = (payload, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const spot = await res.json()
        dispatch(UpdateSpot(spot))
    }
}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const allSpots = {}
            console.log('action spot:', action)
            action.spots.forEach(spot => (allSpots[spot.id] = spot));
            return allSpots
        }
        case GET_A_SPOT: {
            const allSpots = { ...state }
            console.log('action spot:', action.spot)
            // action.spot.forEach(spot => (allSpots[spot.id] = spot));
            return action.spot
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
        case UPDATE_SPOT: {
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
