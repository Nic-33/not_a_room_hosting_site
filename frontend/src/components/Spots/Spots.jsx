import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from "react-router-dom";
import { getSpots } from "../../store/spots.js";
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
        {loaded && <div>
            {spots.map((spot) => {
                const starRat = spot.avgRating
                let starRating
                if (!starRat) {
                    starRating = 0
                } else {
                    starRating = spot.avgRating.toFixed(1)
                }
                // console.log('spot.previewimage:', spot.previewImage)
                return (
                    <>
                    <div id='spotBlock'>
                        <NavLink key={spot.name} to={`/${spot.id}`}>
                            <img src={spot.previewImage} alt={spot.name} />
                            <div id='cityState'>{spot.city}, {spot.state}</div>
                            <div id='starRating'>{starRating} stars</div>
                            <div id='price'>${spot.price} night</div>
                        </NavLink>
                    </div>
                    </>
                )
            })}

        </div>}
    </>
    );
}

export default Spots
