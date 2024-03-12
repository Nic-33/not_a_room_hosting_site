import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getUserReview } from "../../store/review.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import '../../index.css'

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



    return (
        <>
            {loaded && <div>
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
                                    modalComponent={<UpdateReviewModal props={{ reviewId: details.id, spotId: details.Spot.id, name: details.Spot.name }} />}
                                />
                                <OpenModalButton
                                    buttonText='Delete'
                                    modalComponent={<ConfirmDeleteModal props={{ tag: "review", id: details.id }} />}
                                />
                            </ul>
                        </>
                        )
                    })}
            </div>}
        </>
    );
}

export default ManageReviews
