import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Outlet, useParams } from "react-router-dom";
import { getSpots } from "../../store/spots.js";

const Spots = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    const allSpots = useSelector((state) => state.spots)
    console.log(allSpots)
    const spot = allSpots.list.map(spotId => allSpots[spotId])

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    return (
        <main>
            {spot.map((spot) => {
                <NavLink key={spot.name} to={`/spot/${spot.id}`}>
                    <div className={
                        Number.parseInt(spotId)
                    }>
                        <div>
                            {spot.name}
                        </div>
                    </div>
                </NavLink>
            })}
        </main>

    )
}

export default Spots
