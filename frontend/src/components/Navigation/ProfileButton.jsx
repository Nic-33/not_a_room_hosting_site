import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { CiBoxList } from "react-icons/ci";
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { NavLink } from 'react-router-dom';
import './ProfileButton.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className='profileButton' onClick={toggleMenu}>
                <CiBoxList />
                <FaUserCircle />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div id='loggedIn'>
                            <li>Hello, {user.username}</li>
                            <li>{user.email}</li>
                            <li id='link1'>
                                <NavLink key='manageSpot' to={'/spots/current'}>Manage Spots</NavLink>
                            </li>
                            <li id='link2'>
                                <NavLink key='manageReviews' to={'/reviews/current'}>Manage Reviews</NavLink>
                            </li>
                            <li id='button'>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </div>
                    </>
                ) : (
                    <>
                        <div id='loggedOut'>
                            <li >
                                <OpenModalButton
                                    buttonText="Log In"
                                    modalComponent={<LoginFormModal />}
                                />
                            </li>
                            <li>
                                <OpenModalButton
                                    buttonText="Sign Up"
                                    modalComponent={<SignupFormModal />}
                                />
                            </li>
                        </div>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
