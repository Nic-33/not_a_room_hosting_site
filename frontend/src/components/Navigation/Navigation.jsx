import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../Images/temp_image.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navbarContainer'>
      <div id='leftStuff'>
        <NavLink id='logoArea' to="/">
          <img id='logo' src={logo} alt="home" />
        </NavLink>
        <NavLink id='Title' to="/">
          <div id='titleText'>Not A Room Hosting Site</div>
        </NavLink>
      </div>
      <div id='rightStuff'>
        <NavLink id='newSpot' to='/spots/new'>Create a New Spot</NavLink>
        {isLoaded && (
          <div id='profileButton'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  );
}
export default Navigation;
