import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout } from '../redux/slices//authSlice'; // Path to your authSlice
import axios from 'axios';
import { RootState } from '../redux/store'; // Path to your store

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state to wait for authentication check
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/verify', {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          dispatch(login(response.data.user)); // Dispatch user info if authenticated
        } else {
          dispatch(logout())
        }
      } catch (error) {
        console.error('Authentication verification failed', error);
      } finally {
        setLoading(false); // Set loading to false once verification is done
      }
    };

    verifyAuth();
  }, [dispatch]);

  // If still loading, show a loading indicator or nothing
  if (loading) {
    return (
      <div className='w-full h-dvh bg-[#f7f7f7] flex flex-row justify-center items-center gap-4'>
        <img src="/Objects/SemesterLogo.svg" className='h-10 w-10' alt="Semester Logo" />
        <h1 className='text-4xl'>Loading</h1>
      </div>
    )
  }

  // If authenticated, show the children (HomePage); otherwise, redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
