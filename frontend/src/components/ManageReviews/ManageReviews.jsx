import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, getUserReview } from "../../store/review.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";

const ManageReviews = () => {
    const dispatch = useDispatch();
    const spotReviews = useSelector(state => state.review)
    const reviews = Object.values(spotReviews)
    const [loaded, setLoaded] = useState(false)

    // console.log('manageReviews', reviews)


    useEffect(() => {
        dispatch(getUserReview())
            .then(() => setLoaded(true))
    }, [dispatch])

    const delReview = async (e) => {
        // console.log('eeeee', e)
        dispatch(deleteReview(e))
        window.location.reload(false)
    }

    return (
        <>
        {loaded && <div>
        <ol>
            {reviews.map((details) => {
                return (<>
                    <ul>
                        {details.Spot.name}
                    </ul>
                    < ul >
                        {details.review}
                    </ul>
                    <ul>
                        {details.stars}
                    </ul>
                    <ul>
                        <OpenModalButton
                            buttonText='Update'
                            modalComponent={<UpdateReviewModal props={{ reviewId: details.id, spotId: details.Spot.id }} />}
                        />
                        <button onClick={() => delReview(details.id)} value={details.id}>Delete</button>
                    </ul>
                </>
                )
            })}
        </ol >
    </div>}
    </>
    );
}

export default ManageReviews
