import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { getReview, updateReviewInfo } from '../../store/review';
// import './LoginForm.css';
import '../../index.css'

function UpdateReviewModal(props) {
    const { reviewId, spotId, name } = props.props
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.review)
    const reviewValues = Object.values(reviews)
    const updateReview = reviewValues.find(({ id }) => id === reviewId)
    const [review, setReview] = useState(updateReview.review);
    const [stars, setStars] = useState(updateReview.stars);
    const [loaded, setLoaded] = useState(false)

    const { closeModal } = useModal();
    console.log('stars:', stars)

    useEffect(() => {
        dispatch(getReview(spotId))
            .then(() => setLoaded(true))
    }, [dispatch, spotId])

    const handleSubmit = (e) => {
        e.preventDefault();
        let createSpotReview = {
            review,
            stars
        }
        console.log('CreateSpotReview:', createSpotReview)
        if (createSpotReview) {
            dispatch(updateReviewInfo(createSpotReview, reviewId))
            window.location.reload(false)
        }
    };


    return (
        <>
            {loaded && <div>
                <h1>How was your stay at {name}</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <textarea
                            type="text"
                            placeholder='Just a quick review'
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <div className="rate">
                            <input type="radio" id="star5" name="rate" value="5" onClick={(e) => setStars(e.target.value)} />
                            <label htmlFor="star5" title="text"></label>
                            <input type="radio" id="star4" name="rate" value="4" onClick={(e) => setStars(e.target.value)} />
                            <label htmlFor="star4" title="text"></label>
                            <input type="radio" id="star3" name="rate" value="3" onClick={(e) => setStars(e.target.value)} />
                            <label htmlFor="star3" title="text"></label>
                            <input type="radio" id="star2" name="rate" value="2" onClick={(e) => setStars(e.target.value)} />
                            <label htmlFor="star2" title="text"></label>
                            <input type="radio" id="star1" name="rate" value="1" onClick={(e) => setStars(e.target.value)} />
                            <label htmlFor="star1" title="text"></label>
                        </div>
                    </label>
                    <button type="submit">Update Your Review</button>
                </form>
            </div>}
        </>
    );
}

export default UpdateReviewModal;
