import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createNewReview } from '../../store/review';
import { useNavigate } from 'react-router-dom';
// import './LoginForm.css';

function CreateReviewModal(spotId) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const { closeModal } = useModal();


    const handleSubmit = async (e) => {
        e.preventDefault();
        let createSpotReview = {
            "review": review,
            "stars": stars
        }
        // console.log('CreateSpotReview:', createSpotReview)
        if (createSpotReview) {
            dispatch(createNewReview(createSpotReview, spotId))
            window.location.reload(false)
        }
    };


    return (
        <>
            <h1>Submit Review</h1>
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

export default CreateReviewModal;
