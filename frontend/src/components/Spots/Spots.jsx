import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from "react-router-dom";
import { getSpots } from "../../store/spots.js";

const Spots = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    const allSpots = useSelector((state) => state.spots)
    const spots = Object.values(allSpots)
    console.log(spots)
    // const spot = allSpots.list.map(spotId => allSpots[spotId])

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    return (
        <li>
            {spots.map((spot) => {
                console.log('spot.previewimage:', spot.previewImage)
                return (
                    <ol>
                        <div>
                        <img src={spot.previewImage} alt={spot.name} />
                        <NavLink key={spot.name} to={`/${spot.id}`}>{spot.name}</NavLink>
<div>${spot.price} per night</div>
                        </div>
                    </ol>
                )
            })}
        </li>
    );
}

export default Spots
