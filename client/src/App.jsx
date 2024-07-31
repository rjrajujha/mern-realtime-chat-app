import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/contants';

const PrivetRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });

        if (response.status === 200 && response.data.user) setUserInfo(response.data.user);
        else setUserInfo(undefined);

      } catch (error) {
        console.error('Error fetching user data:', error); // Log error
        setUserInfo(undefined);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false); // If userInfo is available, stop loading
    }
  }, [userInfo, setUserInfo]);


  if (loading) return <div>Loading</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/chat' element={<PrivetRoute><Chat /></PrivetRoute>} />
        <Route path='/profile' element={<PrivetRoute><Profile /></PrivetRoute>} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App