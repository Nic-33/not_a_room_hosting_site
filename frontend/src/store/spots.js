import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/getAllSpots'
const CREATE_SPOT = 'spots/createSpot'
const GET_A_SPOT = 'spots/getASpot'
const UPDATE_SPOT = 'spots/update'
const USER_SPOTS = 'spots/userSpots'

const loadSpots = spots => ({
    type: GET_ALL_SPOTS,
    spots
})

const CreateSPOT = spots => ({
    type: CREATE_SPOT,
    spots
})


const loadASpot = spot => ({
    type: GET_A_SPOT,
    spot
})

const UpdateSpot = spot => ({
    type: UPDATE_SPOT,
    spot
})

const UserSpots = spots => ({
    type: USER_SPOTS,
    spots
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

export const getUserSpots = () => async dispatch => {
    const response = await fetch('/api/spots/current')
    // console.log("this is the response:", response)
    if (response.ok) {
        const spots = await response.json()
        console.log("this is the spots in the if block:", spots)
        dispatch(UserSpots(spots.Spots))
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
        console.log('spots with in createspot store', spots)
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
        case USER_SPOTS: {
            const userSpot = {}
            action.spots.forEach(spot => (userSpot[spot.id] = spot));
            return userSpot
        }
        case GET_A_SPOT: {
            return action.spot
        }
        case CREATE_SPOT: {
            return {
                ...state,
                [action.spots.Id]: {
                    ...state[action.spots.Id],
                    spots: [state[action.spots.Id], action.spots.id]
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
