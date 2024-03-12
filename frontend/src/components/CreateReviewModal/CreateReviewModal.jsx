import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewReview } from '../../store/review';
import './CreateReviewModal.css';
import '../../index.css'

function CreateReviewModal(props) {
    const { spotId, name } = props.props
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");

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
                <button id='pointer' type="submit">Submit Your Review</button>
            </form>
        </>
    );
}

export default CreateReviewModal;
