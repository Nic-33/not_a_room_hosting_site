import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, } from "react-router-dom";
import { getSpot } from "../../store/spots.js";
import { getReview } from "../../store/review.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import '../../index.css'

const Spots = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [loaded, setLoaded] = useState(false)
    const spotReviews = useSelector(state => state.review)
    const spotDetails = useSelector((state) => state.spots)
    const session = useSelector(state => state.session);
    const reviews = Object.values(spotReviews).reverse()
    const spotImages = []
    let comingSoon = () => alert("Feature coming soon")

    const numRev = reviews.length
    let revRating = 'new'
    if (numRev === 1) {
        revRating = `${numRev} Review`
    } else if (numRev > 1) {
        revRating = `${numRev} Reviews`
    }

    const starRat = spotDetails.avgStarRating
    let starRating
    if (!starRat) {
        starRating = 0
    }else {
        starRating = spotDetails.avgStarRating.toFixed(1)
    }

    useEffect(() => {
        dispatch(getReview(spotId))
            .then(() => dispatch(getSpot(spotId)))
            .then(() => setLoaded(true))
    }, [dispatch, spotId])


    return (<>

        {loaded && <div>
            <div>{spotDetails.name}</div>
            <div>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}  </div>
            {spotDetails.SpotImages.forEach((image) => (spotImages.push(image.url)))}
            {spotImages.map((image) => {
                return (
                    <>
                        <img src={image} alt="image" />
                    </>
                )
            })}
            <div>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</div>
            <div>{spotDetails.description}</div>

            <div className="reserve-container">
                <div>${spotDetails.price} night</div>
                <div>star {starRating}</div>
                <div>{revRating}</div>
                <button onClick={comingSoon}>Reserve</button>
            </div>

            <ul hidden={session.user && spotDetails.ownerId === session.user.id}>
                <OpenModalButton
                    buttonText='Create Review'
                    modalComponent={<CreateReviewModal props={{ spotId:spotId, name:spotDetails.name }} />}
                />
            </ul>
            <ul>
                <div className="reviews-container">
                    <div>star {starRating}</div>
                    <div>{revRating}</div>
                    <span hidden={reviews.length !== 0 || (session.user && spotDetails.ownerId === session.user.id)}>Be the first to post a review!</span>
                    <div className="review-data">
                        {reviews && reviews.map((review) => {
                            const date = review.createdAt.split('-')
                            const dateCreated = [months[date[1] - 1], date[0]].join(' ')
                            return (
                                <div key={review.Id}>
                                    <p>{review.User.firstName}</p>
                                    <p>{dateCreated}</p>
                                    <p>{review.review}</p>
                                    <ul hidden={session.user && review.userId !== session.user.id}>
                                        <OpenModalButton
                                            buttonText='Update'
                                            modalComponent={<UpdateReviewModal props={{ reviewId: review.id, spotId: review.spotId }} />}
                                        />
                                        <OpenModalButton
                                            buttonText='Delete'
                                            modalComponent={<ConfirmDeleteModal props={{ tag: "review", id: review.id }} />}
                                        />
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </ul>
        </div>}
    </>
    );
}

export default Spots
