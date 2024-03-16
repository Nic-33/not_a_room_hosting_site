import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { getUserSpots } from "../../store/spots.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { FaStar } from "react-icons/fa";

import './ManageSpots.css'
import '../../index.css'


const ManageSpot = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false)
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
        {loaded && <div >

            <NavLink to='/spots/new'>Create a New Spot</NavLink>

            {spotDetails.map((details) => {
                const starRat = details.avgRating
                let starRating
                if (!starRat) {
                    starRating = 'New'
                } else {
                    starRating = details.avgRating.toFixed(1)
                }
                return (<>
                    <div id="displaySpots">
                        <div id="spotBlockWButtons">
                        <NavLink key={details.name} to={`/${details.id}`}>
                            <div id="spotBlock">
                                <img id='preImage' src={details.previewImage} alt={details.name} />
                                <div id="cityState">{details.city}, {details.state}</div>
                                <div id="starRating"><FaStar />{starRating}</div>
                                <div id="price">${details.price} night</div>
                            </div>
                        </NavLink>
                        <div id="updateButton">
                            <button onClick={() => UpdateSpotForm(details.id)}>Update</button>
                        </div>
                        <div id='deleteButton'>
                            <OpenModalButton
                                buttonText='Delete'
                                modalComponent={<ConfirmDeleteModal props={{ tag: "spot", id: details.id }} />}
                            />
                        </div>
                        </div>
                    </div>
                </>
                )
            })}

        </div>}
    </>
    );
}

export default ManageSpot
