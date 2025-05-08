import {
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = 'us-east-2';
const USER_POOL_CLIENT_ID = '3lif6p1jpede05fd6feumimu3v';

const client = new CognitoIdentityProviderClient({ region: REGION });

export async function authenticateUser(username: string, password: string) {
  // NOTE: This results in HTTP400 Bad Request when username or password are incorrect
  // However, the headers will contain this information if it becomes important to use later on
  // x-amzn-errormessage: Incorrect username or password.
  // x-amzn-errortype: NotAuthorizedException:
  // x-amzn-requestid: b69e68b4-3e60-491d-aea4-c54a9a911add
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await client.send(command);
  // return response.AuthenticationResult?.AccessToken || null;
  return response.AuthenticationResult;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const token = localStorage.getItem('accessToken'); // or retrieve from your state management

  if (!token) {
    throw new Error('User is not authenticated.');
  }

  const command = new ChangePasswordCommand({
    PreviousPassword: currentPassword,
    ProposedPassword: newPassword,
    AccessToken: token,
  });

  try {
    await client.send(command);
  } catch (error) {
    throw error;
  }
}

export async function initiateForgotPassword(username: string): Promise<void> {
  const command = new ForgotPasswordCommand({
    ClientId: USER_POOL_CLIENT_ID, // Your Cognito App Client ID
    Username: username,
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error('Error initiating forgot password:', error);
    throw new Error('Failed to send verification code. Please try again.');
  }
}

export async function confirmForgotPassword(
  username: string,
  code: string,
  newPassword: string
): Promise<void> {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: USER_POOL_CLIENT_ID, // Your Cognito App Client ID
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  });

  try {
    await client.send(command);
  } catch (error) {
    throw error;
  }
}

export async function refreshAuthToken(
  refreshToken: string
): Promise<{ accessToken: string; idToken: string }> {
  const command = new InitiateAuthCommand({
    AuthFlow: 'REFRESH_TOKEN',
    ClientId: USER_POOL_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  try {
    const response: InitiateAuthCommandOutput = await client.send(command);
    const accessToken = response.AuthenticationResult?.AccessToken;
    const idToken = response.AuthenticationResult?.IdToken;

    if (!accessToken || !idToken) {
      throw new Error('Failed to refresh access token.');
    }

    return { accessToken, idToken };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Could not refresh token. Please log in again.');
  }
}
