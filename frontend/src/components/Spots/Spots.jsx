import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from "react-router-dom";
import { getSpots } from "../../store/spots.js";

const Spots = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    const allSpots = useSelector((state) => state.spots)
    const [loaded, setLoaded] = useState(false)

    const spots = Object.values(allSpots)
    console.log(spots)
    // const spot = allSpots.list.map(spotId => allSpots[spotId])

    useEffect(() => {
        dispatch(getSpots())
            .then(() => setLoaded(true))

    }, [dispatch])

    return (
        <li>
            {spots.map((spot) => {
                // console.log('spot.previewimage:', spot.previewImage)
                return (
                    <>
                        {loaded && <div>
                            <NavLink key={spot.name} to={`/${spot.id}`}>
                                <img src={spot.previewImage} alt={spot.name} />
                                <div>{spot.city}, {spot.state}</div>
                                <div>{spot.avgRating} stars</div>
                                <div>${spot.price} night</div>
                            </NavLink>
                        </div>}
                    </>
                )
            })}
        </li>
    );
}

export default Spots
