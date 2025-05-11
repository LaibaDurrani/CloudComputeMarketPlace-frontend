import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // If auth is still loading, show nothing or a loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login with the return url
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
