import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { changePassword } from '../../client/cognitoClient';

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const validationInitState = {
    password: false,
    newPassword: false,
    newPasswordConfirm: false,
  };
  const [validationErrors, setValidationErrors] = useState(validationInitState);

  const handleChange = async () => {
    if (!password || !newPassword || !newPasswordConfirm) {
      setValidationErrors({
        ...validationErrors,
        password: !password,
        newPassword: !newPassword,
        newPasswordConfirm: !newPasswordConfirm,
      });
      setError('Please fill in all required fields.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError('New Passwords do not match.');
      return;
    }
    try {
      await changePassword(password, newPassword);
      setError(null);
      setValidationErrors(validationInitState);
      setMessage('Successfully changed password.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: false });
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
    if (validationErrors.newPassword) {
      setValidationErrors({ ...validationErrors, newPassword: false });
    }
  };

  const handleNewPasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPasswordConfirm(e.target.value);
    setError(null);
    if (validationErrors.newPasswordConfirm) {
      setValidationErrors({ ...validationErrors, newPasswordConfirm: false });
    }
  };

  return (
    <div>
      <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
        <div className="flex flex-col gap-2 mx-auto max-w-xl bg-white mt-5 pl-20 pr-20 pt-10 pb-32 rounded">
          <div className="flex justify-center">
            <Typography variant="h4">Change password</Typography>
          </div>
          <TextField
            label="Current Password"
            type="password"
            variant="outlined"
            value={password}
            error={validationErrors.password}
            helperText={
              validationErrors.password ? 'Current password is required.' : ''
            }
            onChange={handlePasswordChange}
            fullWidth
            sx={{
              mt: 6,
            }}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            error={validationErrors.newPassword}
            helperText={
              validationErrors.newPassword ? 'New password is required.' : ''
            }
            onChange={handleNewPasswordChange}
            fullWidth
            sx={{
              mt: 4,
            }}
          />
          <TextField
            label="New Password (Confirm)"
            type="password"
            variant="outlined"
            value={newPasswordConfirm}
            error={validationErrors.newPasswordConfirm}
            helperText={
              validationErrors.newPasswordConfirm
                ? 'New Password confirmation is required.'
                : ''
            }
            onChange={handleNewPasswordConfirmChange}
            fullWidth
            sx={{
              mt: 1,
            }}
          />
          {error && <div className="text-boperror">{error}</div>}
          {message && <div className="text-bopsuccess">{message}</div>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleChange}
            sx={{
              mt: 2,
              minHeight: 50,
            }}
          >
            Change password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
