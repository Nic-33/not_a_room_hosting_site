import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, } from "react-router-dom";
import { getSpot } from "../../store/spots.js";
import { getReview } from "../../store/review.js";
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal.jsx";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal.jsx";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { LuDot } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import './SpotDetails.css'
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
    let revRating = 'New'
    if (numRev === 1) {
        revRating = `${numRev} Review`
    } else if (numRev > 1) {
        revRating = `${numRev} Reviews`
    }

    const starRat = spotDetails.avgStarRating
    let starRating
    if (!starRat) {
        starRating = 0
    } else {
        starRating = spotDetails.avgStarRating.toFixed(1)
    }

    useEffect(() => {
        dispatch(getReview(spotId))
            .then(() => dispatch(getSpot(spotId)))
            .then(() => setLoaded(true))
    }, [dispatch, spotId])


    return (<>

        {loaded && <div id="spotDetails">
            <div id="info">
                <h1 id="spotName">{spotDetails.name}</h1>
                <h3 id="spotLocation">{spotDetails.city}, {spotDetails.state}, {spotDetails.country}  </h3>
                <div id="spotImages">
                    {spotDetails.SpotImages.forEach((image) => (spotImages.push({ id: image.id, url: image.url })))}
                    {spotImages.map((image) => {
                        return (
                            <>
                                <div id={`image${spotImages.indexOf(image)}`}>
                                    <img src={image.url} alt="image" />
                                </div>
                            </>
                        )
                    })}
                </div>
                <div id="infoArea">
                    <h2 id="host">Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h2>
                    <h4 id="dis">{spotDetails.description}</h4>

                    <div id="reserve">
                        <div id="cost">
                            <h2>${spotDetails.price}</h2>
                            <h4>night</h4>
                        </div>
                        <div id="rating">
                            <div><FaStar />{starRating}</div>
                            <LuDot />
                            <div>{revRating}</div>
                        </div>
                        <div id="reserveButtonContainer">
                            <button className="reserveButton" onClick={comingSoon}>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="reviews">
                <div id='reviewRating'>
                    <div><FaStar /> {starRating}</div>
                    <LuDot />
                    <div hidden={revRating === 'New'}>{revRating}</div>
                    <div hidden={reviews.length !== 0 || (session.user && spotDetails.ownerId === session.user.id)}>Be the first to post a review!</div>
                </div>
                <div hidden={session.user && spotDetails.ownerId === session.user.id}>
                    <OpenModalButton
                        buttonText='Create Review'
                        modalComponent={<CreateReviewModal props={{ spotId: spotId, name: spotDetails.name }} />}
                    />
                </div>
                {reviews && reviews.map((review) => {
                    const date = review.createdAt.split('-')
                    const dateCreated = [months[date[1] - 1], date[0]].join(' ')
                    return (
                        <div id="reviewText">
                            <div key={review.Id}>
                                <div id="userName">{review.User.firstName}</div>
                                <div id="dateCreated">{dateCreated}</div>
                                <div id="text">{review.review}</div>
                                <div hidden={session.user && review.userId !== session.user.id}>
                                    <OpenModalButton
                                        buttonText='Update'
                                        modalComponent={<UpdateReviewModal props={{ reviewId: review.id, spotId: review.spotId }} />}
                                    />
                                    <OpenModalButton
                                        buttonText='Delete'
                                        modalComponent={<ConfirmDeleteModal props={{ tag: "review", id: review.id }} />}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>}
    </>
    );
}

export default Spots
