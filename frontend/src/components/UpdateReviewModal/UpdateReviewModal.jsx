import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { getReview, updateReviewInfo } from '../../store/review';
// import './LoginForm.css';

function UpdateReviewModal(props) {
    const { reviewId, spotId } = props.props
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.review)
    const reviewValues = Object.values(reviews)
    // console.log('review object:', props)
    // console.log('review id:', reviewId)
    const updateReview = reviewValues.find(({ id }) => id === reviewId)
    // console.log('update review: ', updateReview)
    const [review, setReview] = useState(updateReview.review);
    const [stars, setStars] = useState(updateReview.stars);
    const { closeModal } = useModal();
    console.log('stars:', stars)

    useEffect(() => {
        dispatch(getReview(spotId))
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
            <h1>Update Review</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="number"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default UpdateReviewModal;
