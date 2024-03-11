import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { getSpots, deleteSpot } from "../../store/spots.js";


const ManageSpot = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false)
    const sessionId = useSelector(state => state.session.user.id)
    const allSpots = useSelector((state) => state.spots)
    const spots = Object.values(allSpots)

    // console.log('manageSpot: ', spots)

    const spotDetails = spots.filter(({ ownerId }) => ownerId === sessionId)
    // console.log('spot details: ', spotDetails)

    useEffect(() => {
        dispatch(getSpots())
            .then(() => setLoaded(true))

    }, [dispatch])

    const UpdateSpotForm = async (e) => {
        navigate(`/spots/${e}/edit`)
    }

    const delSpot = async (e) => {
        dispatch(deleteSpot(e))
        window.location.reload(false)
    }

    return (<>
        {loaded && <div>

            <NavLink to='/spots/new'>Create a New Spot</NavLink>

            {spotDetails.map((details) => {
                return (<>
                    <div>
                        <NavLink key={details.name} to={`/${details.id}`}>
                            <img src={details.previewImage} alt={details.name} />
                            <div>{details.city}, {details.state}</div>
                            <div>{details.avgRating} Stars</div>
                            <div>${details.price} night</div>
                        </NavLink>
                        <ul>
                            <button onClick={() => UpdateSpotForm(details.id)}>Update</button>
                            <button onClick={() => delSpot(details.id)} value={details.id}>Delete</button>
                        </ul>
                    </div>
                </>
                )
            })}

        </div>}
    </>
    );
}

export default ManageSpot
