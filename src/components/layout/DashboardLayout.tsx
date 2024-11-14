import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import LeftNav from '../leftNav/LeftNav';
import { useAtom } from 'jotai/index';
import {
  accessTokenWithPersistenceAtom,
  idTokenWithPersistenceAtom,
  refreshTokenWithPersistenceAtom,
} from '../../atoms';
import { isTokenValid } from '../utils/authUtils';
import { refreshAuthToken } from '../../client/cognitoClient';
import { updateBopmaticClientToken } from '../../client/client';

const DashboardLayout: React.FC = () => {
  const [accessToken, setAccessToken] = useAtom(accessTokenWithPersistenceAtom);
  const [refreshToken] = useAtom(refreshTokenWithPersistenceAtom);
  const [, setIdToken] = useAtom(idTokenWithPersistenceAtom);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is valid; if not, redirect to login
    if (!isTokenValid(accessToken)) {
      // first, try and refresh the token
      if (refreshToken) {
        refreshAuthToken(refreshToken)
          .then((tokens) => {
            setAccessToken(tokens.accessToken);
            setIdToken(tokens.idToken);
          })
          .catch((err) => {
            // Failed to refresh token, redirect to login
            console.log('Error refreshing token:', err);
            setAccessToken(null);
            setIdToken(null);
            navigate('/login');
          });
      } else {
        // We don't have refresh token, redirect user to login
        setAccessToken(null);
        setIdToken(null);
        navigate('/login');
      }
    }
  }, [accessToken, navigate, refreshToken, setAccessToken, setIdToken]);

  // initialize client with token in case of persistence from local storage
  useEffect(() => {
    if (accessToken) {
      updateBopmaticClientToken(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <Header />
      <div className="flex justify-between">
        <LeftNav />
        <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
