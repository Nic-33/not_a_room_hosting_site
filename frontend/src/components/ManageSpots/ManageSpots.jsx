import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { getSpots, getUserSpots } from "../../store/spots.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import '../../index.css'


const ManageSpot = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false)
    const sessionId = useSelector(state => state.session.user.id)
    const allSpots = useSelector((state) => state.spots)
    const spotDetails = Object.values(allSpots)


    useEffect(() => {
        dispatch(getUserSpots())
            .then(() => setLoaded(true))
    }, [dispatch])

    const UpdateSpotForm = async (e) => {
        navigate(`/spots/${e}/edit`)
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
                            <div>{details.avgRating.toFixed(1)} Stars</div>
                            <div>${details.price} night</div>
                        </NavLink>
                        <ul>
                            <button onClick={() => UpdateSpotForm(details.id)}>Update</button>
                            <OpenModalButton
                                buttonText='Delete'
                                modalComponent={<ConfirmDeleteModal props={{ tag: "spot", id: details.id }} />}
                            />
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
