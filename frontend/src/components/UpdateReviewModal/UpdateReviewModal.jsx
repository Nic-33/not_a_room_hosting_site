import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateReviewInfo } from '../../store/review';
import './UpdateReviewModal.css';
import '../../index.css'

function UpdateReviewModal(props) {
    console.log('props', props)
    const { id, review, stars } = props.props.details

    const dispatch = useDispatch();
    const [reviewState, setReview] = useState(review);
    const [starsState, setStars] = useState(stars);

    console.log('stars:', stars)

    const handleSubmit = async (e) => {
        e.preventDefault();
        let createSpotReview = {
            review: reviewState,
            stars: starsState
        }
        console.log('CreateSpotReview:', createSpotReview)
        if (createSpotReview) {
            dispatch(updateReviewInfo(createSpotReview, id))
            window.location.reload(false)
        }
    };


    return (
        <>
            <div id='review'>
                <div id='spotTitle'>How was your stay at {props.props.details.Spot.name}</div>
                <form id='reviewInfo' onSubmit={handleSubmit}>
                    <label>
                        <textarea
                            id='reviewText'
                            type="text"
                            placeholder='Just a quick review'
                            value={reviewState}
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
                    <div id='button'>
                        <button type="submit">Update Your Review</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UpdateReviewModal;
