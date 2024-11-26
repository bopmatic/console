import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import Header from '../header/Header';
import BopmaticLink from '../link/BopmaticLink';
import { useNavigate } from 'react-router-dom';
import { getSignupClient } from '../../client/client';
import { RequestAccessRequest } from '../../client/signupapi';

interface RequestAccessFormData {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  language: string;
  projectDesc: string;
}

const RequestAccess: React.FC = () => {
  const [formData, setFormData] = useState<RequestAccessFormData>({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    language: '',
    projectDesc: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof RequestAccessFormData, boolean>
  >({
    email: false,
    firstName: false,
    lastName: false,
    username: false,
    language: false,
    projectDesc: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'initiate' | 'success'>('initiate');
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    const errors = {
      email: !formData.email || !isValidEmail(formData.email),
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      username: !formData.username,
      language: !formData.language,
      projectDesc: !formData.projectDesc,
    };

    setValidationErrors(errors);

    return !Object.values(errors).some((hasError) => hasError);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      setError('Please fill out all required fields correctly.');
      return;
    }

    try {
      setError(null);
      const req: RequestAccessRequest = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.username,
        programmingLang: formData.language,
        projectDesc: formData.projectDesc,
      };
      await getSignupClient().requestAccess(req);
      setStage('success'); // Set stage to success on completion
    } catch (e) {
      setError('Failed to submit request. Please try again.');
    }
  };

  const handleInputChange =
    (field: keyof RequestAccessFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError(null);
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: false }));
      }
    };

  return (
    <div>
      <Header hideUser={true} />
      <div className="flex-grow h-screen overflow-auto bg-bopgreybkg p-6">
        <div className="flex flex-col gap-2 mx-auto max-w-xl bg-white mt-5 pl-20 pr-20 pt-10 pb-32 rounded">
          {stage === 'initiate' ? (
            <>
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
              {[
                { label: 'First name', field: 'firstName' },
                { label: 'Last name', field: 'lastName' },
                { label: 'Email', field: 'email' },
                { label: 'Desired username', field: 'username' },
                { label: 'Programming language', field: 'language' },
                { label: 'Project description', field: 'projectDesc' },
              ].map(({ label, field }) => (
                <TextField
                  key={field}
                  label={label}
                  variant="outlined"
                  value={formData[field as keyof RequestAccessFormData]}
                  error={validationErrors[field as keyof RequestAccessFormData]}
                  helperText={
                    validationErrors[field as keyof RequestAccessFormData]
                      ? `${label} is required and must be valid.`
                      : ''
                  }
                  onChange={handleInputChange(
                    field as keyof RequestAccessFormData
                  )}
                  fullWidth
                  multiline={field === 'projectDesc'}
                  sx={{ mt: 1 }}
                />
              ))}
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
            </>
          ) : (
            <div className="flex justify-center">
              <div>
                <div className="font-bold text-center mt-4">
                  Thank you! Your request has been submitted successfully.
                </div>
                <div className="text-center mt-4">
                  We will reach out via email when you have been added to our
                  system.
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate('/login');
                    }}
                    sx={{
                      mt: 2,
                      minHeight: 50,
                    }}
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
