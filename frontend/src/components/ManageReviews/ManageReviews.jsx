import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams, } from "react-router-dom";
import { deleteReview, getUserReview } from "../../store/review.js";

const ManageReviews = () => {
    const navigate = useNavigate
    const dispatch = useDispatch();
    const sessionId = useSelector(state => state.session.user.id)
    const spotReviews = useSelector(state => state.review)
    const reviews = Object.values(spotReviews)
    console.log('manageReviews', reviews)


    useEffect(() => {
        dispatch(getUserReview())
    }, [dispatch])

    const delReview = async (e) => {
        console.log('eeeee', e)
        dispatch(deleteReview(e))
        window.location.reload(false)
    }

    return (<>
        <ol>
            {reviews.map((details) => {
                return (<>
                    < ul >
                        {details.review}
                    </ul>
                    <ul>
                        <button>Update</button>
                        <button onClick={() => delReview(details.id)} value={details.id}>Delete</button>
                    </ul>
                </>
                )
            })}
        </ol >
    </>
    );
}

export default ManageReviews
