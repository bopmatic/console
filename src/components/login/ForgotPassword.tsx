import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import {
  confirmForgotPassword,
  initiateForgotPassword,
} from '../../client/cognitoClient';
import BopmaticLink from '../link/BopmaticLink';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'initiate' | 'confirm' | 'success'>(
    'initiate'
  );
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const validationInitState = {
    username: false,
    code: false,
    password: false,
    passwordConfirm: false,
  };
  const [validationErrors, setValidationErrors] = useState(validationInitState);
  const navigate = useNavigate();

  const initiatePasswordReset = async () => {
    if (!username) {
      setValidationErrors({ ...validationErrors, username: true });
      setError('Please enter your username.');
      return;
    }
    try {
      await initiateForgotPassword(username);
      setStage('confirm');
      setError(null);
      setValidationErrors(validationInitState);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const confirmPasswordReset = async () => {
    if (!username || !code || !password || !passwordConfirm) {
      setValidationErrors({
        ...validationErrors,
        username: !username,
        code: !code,
        password: !password,
        passwordConfirm: !passwordConfirm,
      });
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await confirmForgotPassword(username, code, password);
      setStage('success');
      setError(null);
      setValidationErrors(validationInitState);
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
    }
  };

  // Handlers to clear validation errors on typing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(null);
    if (validationErrors.username) {
      setValidationErrors(validationInitState);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError(null);
    if (validationErrors.code) {
      setValidationErrors(validationInitState);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
    if (validationErrors.password) {
      setValidationErrors(validationInitState);
    }
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(e.target.value);
    setError(null);
    if (validationErrors.passwordConfirm) {
      setValidationErrors({ ...validationErrors, passwordConfirm: false });
    }
  };

  return (
    <div>
      <Header />
      <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
        <div className="flex flex-col gap-2 mx-auto max-w-xl bg-white mt-5 pl-20 pr-20 pt-10 pb-32 rounded">
          {stage === 'initiate' ? (
            <>
              <div className="flex justify-center">
                <Typography variant="h4">Password Reset</Typography>
              </div>
              <div className="flex justify-center text-sm text-bopgreytext">
                <div className="pr-2">We can help you reset your password.</div>
              </div>
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                error={validationErrors.username}
                helperText={
                  validationErrors.username ? 'Username is required.' : ''
                }
                onChange={handleUsernameChange}
                fullWidth
                sx={{
                  mt: 4,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={initiatePasswordReset}
                sx={{
                  mt: 2,
                  minHeight: 50,
                }}
              >
                Reset password
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              <div className="min-h-0 border-bopgreybkg border mt-6"></div>
              <div className="flex justify-center text-xs mt-4">
                <div className="pr-2">Already have a reset password code?</div>
                <BopmaticLink to="#" onClick={() => setStage('confirm')}>
                  Click here
                </BopmaticLink>
              </div>
              <div className="min-h-0 border-bopgreybkg border mt-6"></div>
              <div className="flex justify-center text-xs mt-4">
                Remembered your password?
              </div>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  mt: 2,
                  minHeight: 50,
                  borderColor: '#D7DBEC',
                  color: '#5A607F',
                }}
              >
                Sign in
              </Button>
            </>
          ) : stage === 'confirm' ? (
            <>
              <div className="flex justify-center">
                <Typography variant="h4">Confirmation Email</Typography>
              </div>
              <div className="flex justify-center text-sm text-bopgreytext">
                <div className="pr-2">
                  Check your username and enter confirmation code below.
                </div>
              </div>
              <TextField
                label="Confirmation code"
                variant="outlined"
                value={code}
                error={validationErrors.code}
                helperText={
                  validationErrors.code ? 'Confirmation code is required.' : ''
                }
                onChange={handleCodeChange}
                fullWidth
                sx={{
                  mt: 4,
                }}
              />
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                error={validationErrors.username}
                helperText={
                  validationErrors.username ? 'Username is required.' : ''
                }
                onChange={handleUsernameChange}
                fullWidth
                sx={{
                  mt: 4,
                }}
              />
              <TextField
                label="New password"
                variant="outlined"
                value={password}
                type="password"
                error={validationErrors.password}
                helperText={
                  validationErrors.password ? 'Password is required.' : ''
                }
                onChange={handlePasswordChange}
                fullWidth
                sx={{
                  mt: 4,
                }}
              />
              <TextField
                label="New password (confirm)"
                variant="outlined"
                value={passwordConfirm}
                type="password"
                error={validationErrors.passwordConfirm}
                helperText={
                  validationErrors.passwordConfirm
                    ? 'Password (confirm) is required.'
                    : ''
                }
                onChange={handlePasswordConfirmChange}
                fullWidth
                sx={{
                  mt: 1,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={confirmPasswordReset}
                sx={{
                  mt: 2,
                  minHeight: 50,
                }}
              >
                Set new password
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <Typography variant="h4">Success!</Typography>
              </div>
              <div className="flex justify-center text-sm text-bopgreytext">
                <div className="pr-2 text-center">
                  Your password has been successfully changed. You may now use
                  your new password to login.
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{
                  mt: 2,
                  minHeight: 50,
                }}
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
