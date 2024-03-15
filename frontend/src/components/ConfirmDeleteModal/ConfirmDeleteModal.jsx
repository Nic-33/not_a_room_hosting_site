import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from "../../store/review.js";
import { deleteSpot } from "../../store/spots.js";
import './ConfirmDeleteModal.css'
import '../../index.css'

// import './LoginForm.css';

function ConfirmDeleteModal(props) {
    const { tag, id } = props.props
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const confirm = (e) => {
        if (tag === 'review') {
            dispatch(deleteReview(e))
            window.location.reload(false)
        }
        if (tag === 'spot') {
            dispatch(deleteSpot(e))
            window.location.reload(false)
        }
    }

    const deny = () => {
        closeModal()
    }


    return (
        <>
        <div id='confirmDelete'>
            <h1>Confirm Delete</h1>
            <h2>Are you sure you want to delete {tag} </h2>
            <form>
                <button onClick={() => confirm(id)}>Yes(Delete {tag})</button>
                <button onClick={() => deny()}>No (Keep {tag})</button>
            </form>
            </div>
        </>
    );
}

export default ConfirmDeleteModal;
