import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import Header from '../header/Header';
import BopmaticLink from '../link/BopmaticLink';

const RequestAccess: React.FC = () => {
  const [email, setEmail] = useState('');
  const validationInitState = {
    email: false,
  };
  const [validationErrors, setValidationErrors] = useState(validationInitState);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'initiate' | 'success'>('success');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setValidationErrors({ ...validationErrors, email: true });
      setError('Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // TODO: Add BACKEND API CALL TO REQUEST WAITLIST
    console.log(
      'This is where we submit the waitlist request to Mikes backend'
    );
    // check if success
  };

  // Handlers to clear validation errors on typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    if (validationErrors.email) {
      setValidationErrors(validationInitState);
    }
  };

  if (stage === 'initiate') {
    return (
      <div>
        <Header hideUser={true} />
        <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
          <div className="flex flex-col gap-2 mx-auto max-w-xl bg-white mt-5 pl-20 pr-20 pt-10 pb-32 rounded">
            <div className="flex justify-center">
              <Typography variant="h4">Request Access</Typography>
            </div>
            <div className="flex justify-center text-sm">
              <div className="pr-2 text-bopgreytext">
                Already have an account?
              </div>
              <BopmaticLink to="/login">Login</BopmaticLink>
            </div>
            <div className="text-sm flex justify-center text-center text-bopgreytext mt-4">
              When we are able to grant you access to the Bopmatic system you
              will be notified via email.
            </div>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              error={validationErrors.email}
              helperText={validationErrors.email ? 'Email is required.' : ''}
              onChange={handleEmailChange}
              fullWidth
              sx={{
                mt: 4,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                mt: 2,
                minHeight: 50,
              }}
            >
              Request access
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <span>success</span>
      </div>
    );
  }
};

export default RequestAccess;
