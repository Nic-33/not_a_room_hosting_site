import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, } from "react-router-dom";
import { getSpots } from "../../store/spots.js";
import { getReview } from "../../store/review.js";

const Spots = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    // const { spotId } = match.params
    const spotReviews = useSelector(state => state.review)
    const allSpots = useSelector((state) => state.spots)
    const reviews = Object.values(spotReviews)
    const spots = Object.values(allSpots)
    // const review = Object.values(allReviews)
    console.log('review: ', spotReviews)

    // const spot = allSpots.list.map(spotId => allSpots[spotId])
    const spotDetails = spots.find(({ id }) => id === parseInt(spotId))
    // console.log(spotId)
    console.log('spot details: ', spotDetails)

    useEffect(() => {
        dispatch(getReview(spotId))
            .then(() => dispatch(getSpots()))
    }, [dispatch, spotId])

    return (<>
        <ol>
            {spotDetails.name}
            <ul>
                {spotDetails.price}
            </ul>
        </ol>
        <ul>
            {reviews.map((review) => {
                return (<>
                    <div>
                        {review.User.firstName}
                    </div>
                    <ul>
                        {review.review}
                    </ul>
                </>
                )
            })}
        </ul>
    </>
    );
}

export default Spots
