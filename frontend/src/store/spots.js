const GET_ALL_SPOTS = 'spots/getAllSpots'

const loadSpots = spots => ({
    type: GET_ALL_SPOTS,
    spots
})

export const getSpots = () => async dispatch => {
    const response = await fetch('/api/spots')
    console.log(response)
    if (response.ok) {
        const spots = await response.json()
        dispatch(loadSpots(spots))
        return spots
    }
}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const allSpots = { ...state }
            action.spots.forEach(spot => (allSpots[spot.id] = spot));
            return allSpots
        }
        default:
            return state
    }
}

export default spotsReducer
