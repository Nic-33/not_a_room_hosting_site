import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, } from "react-router-dom";
import { getSpot } from "../../store/spots.js";
import { getReview, deleteReview } from "../../store/review.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";


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
    let rating
    if (numRev === 0) {
        rating = 'New'
    } else if (numRev === 1) {
        rating = `${numRev} Review`
    } else {
        rating = `${numRev} Reviews`
    }

    useEffect(() => {
        dispatch(getReview(spotId))
            .then(() => dispatch(getSpot(spotId)))
            .then(() => setLoaded(true))
    }, [dispatch, spotId])

    const delReview = async (e) => {
        dispatch(deleteReview(e))
        window.location.reload(false)
    }

    return (<>

        {loaded && <div>
            <ol>
                {spotDetails.name}
                <div>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}  </div>
                {spotDetails.SpotImages.forEach((image) => (spotImages.push(image.url)))}
                {spotImages.map((image) => {
                    return (
                        <>
                            <img src={image} alt="image" />
                        </>
                    )
                })}
                {spotDetails.price}
                <div>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</div>
                <div>{spotDetails.description}</div>
            </ol>

            <div className="reserve-container">
                <div>${spotDetails.price} night</div>
                <div>star {spotDetails.avgStarRating}</div>
                <div>{rating}</div>
                <button onClick={comingSoon}>Reserve</button>
            </div>

            <ul hidden={session.user && spotDetails.ownerId === session.user.id}>
                <OpenModalButton

                    buttonText='Create Review'
                    modalComponent={<CreateReviewModal props={spotId} />}
                />
            </ul>
            <ul>
                <div className="reviews-container">
                    <div>star {spotDetails.avgStarRating}</div>
                    <div>{rating}</div>
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
                                        <button onClick={() => delReview(review.id)} value={review.id}>Delete</button>
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
