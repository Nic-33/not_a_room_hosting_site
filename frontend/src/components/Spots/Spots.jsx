import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getSpots } from "../../store/spots.js";
import { FaStar } from "react-icons/fa";
import './Spots.css'
import '../../index.css'

const Spots = () => {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => state.spots)
    const [loaded, setLoaded] = useState(false)

    const spots = Object.values(allSpots)
    // console.log(spots)

    useEffect(() => {
        dispatch(getSpots())
            .then(() => setLoaded(true))

    }, [dispatch])

    return (<>
        {loaded && <div id='displaySpots'>
            {spots.map((spot) => {
                const starRat = spot.avgRating
                let starRating
                if (!starRat) {
                    starRating = 'New'
                } else {
                    starRating = `${spot.avgRating.toFixed(1)}`
                }
                // console.log('spot.previewimage:', spot.previewImage)
                return (
                    <>
                        <NavLink key={spot.name} to={`/${spot.id}`}>
                            <div id='spotBlock'>
                                <img id="preImage" src={spot.previewImage} alt={spot.name} />
                                <div id='cityState'>{spot.city}, {spot.state}</div>
                                <div id='starRating'><FaStar />{starRating}</div>
                                <div id='price'>${spot.price} night</div>
                            </div>
                        </NavLink>
                    </>
                )
            })}

        </div>}
    </>
    );
}

export default Spots
