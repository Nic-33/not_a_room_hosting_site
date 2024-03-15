import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewReview } from '../../store/review';
import './CreateReviewModal.css';
import '../../index.css'

function CreateReviewModal(props) {
    // const { data, error } = useGetPostsQuery()
    const { spotId, name } = props.props
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    let error

    const handleSubmit = async (e) => {
        e.preventDefault();
        let createSpotReview = {
            "review": review,
            "stars": stars
        }
        // console.log('CreateSpotReview:', createSpotReview)
        if (createSpotReview) {
            dispatch(createNewReview(createSpotReview, spotId))
            console.log('error', error)
            window.location.reload(false)
        }
    };


    return (
        <>
            <div id='review'>
                <div id='spotTitle'>How was your stay at {name}</div>
                <form id='reviewInfo' onSubmit={handleSubmit}>
                    <label>
                        <textarea
                            id='reviewText'
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
                    <div id='button'>
                        <button type="submit">Update Your Review</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateReviewModal;
