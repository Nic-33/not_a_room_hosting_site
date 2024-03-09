import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import Spots from './components/Spots/Spots';
import SpotsDetails from './components/SpotsDetails/SpotDetails'
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm'
import ManageSpot from './components/ManageSpots/ManageSpots';
import ManageReviews from './components/ManageReviews/ManageReviews'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/:spotId',
        element: <SpotsDetails />
      },
      {
        path: '/spots/new',
        element:<CreateSpotForm />
      },
      {
        path: '/spots/current',
        element:<ManageSpot />
      },
      {
        path:'/reviews/current',
        element:<ManageReviews />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
