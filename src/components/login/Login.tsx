import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { authenticateUser } from '../../client/cognitoClient';
import {
  accessTokenWithPersistenceAtom,
  idTokenWithPersistenceAtom,
  refreshTokenWithPersistenceAtom,
  usernameWithPersistenceAtom,
} from '../../atoms';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import BopmaticLink from '../link/BopmaticLink';
import { updateBopmaticClientToken } from '../../client/client';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [, setUsernameAtom] = useAtom(usernameWithPersistenceAtom);
  const [, setAccessToken] = useAtom(accessTokenWithPersistenceAtom);
  const [, setRefreshToken] = useAtom(refreshTokenWithPersistenceAtom);
  const [, setIdToken] = useAtom(idTokenWithPersistenceAtom);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await authenticateUser(username, password);
      if (
        response &&
        response?.AccessToken &&
        response?.RefreshToken &&
        response?.IdToken
      ) {
        setAccessToken(response?.AccessToken);
        setRefreshToken(response?.RefreshToken);
        setIdToken(response?.IdToken);
        setUsernameAtom(username);
        setError(null);
        navigate('/');
      } else {
        setError('Failed to authenticate');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <Header hideUser={true} />
      <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
        <div className="flex flex-col gap-2 mx-auto max-w-xl bg-white mt-5 pl-20 pr-20 pt-10 pb-32 rounded">
          <div className="flex justify-center">
            <Typography variant="h4">Sign in</Typography>
          </div>
          <div className="flex justify-center text-sm">
            <div className="pr-2 text-bopgreytext">New to Bopmatic?</div>
            <BopmaticLink to="/request-access">Request access</BopmaticLink>
          </div>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{
              mt: 4,
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{
              mt: 2,
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              mt: 2,
              minHeight: 50,
            }}
          >
            Sign in
          </Button>
          <div className="flex justify-center text-xs mt-4">
            <BopmaticLink to="/forgot-password">
              Forgot your password?
            </BopmaticLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
