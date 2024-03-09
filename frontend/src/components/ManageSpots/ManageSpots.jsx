import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams, } from "react-router-dom";
import { getSpots, deleteSpot } from "../../store/spots.js";


const ManageSpot = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [spotId, setSpotId] = useState()
    const sessionId = useSelector(state => state.session.user.id)
    const allSpots = useSelector((state) => state.spots)
    const spots = Object.values(allSpots)
    // console.log('manageSpot: ', spots)

    const spotDetails = spots.filter(({ ownerId }) => ownerId === sessionId)
    // console.log('spot details: ', spotDetails)

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    const delSpot = async (e) => {
        console.log('eeeee', e)
        dispatch(deleteSpot(e))
        window.location.reload(false)
    }

    return (<>
        <ol>
            {spotDetails.map((details) => {
                return (<>
                    < ul >
                        {details.name}
                        {details.price}
                    </ul>
                    <ul>
                        <button>Update</button>
                        <button onClick={() => delSpot(details.id)} value={details.id}>Delete</button>
                    </ul>
                </>
                )
            })}
        </ol >
    </>
    );
}

export default ManageSpot
