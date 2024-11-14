import { jwtDecode } from 'jwt-decode';
import {
  ACCESS_TOKEN_KEY,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USERNAME_KEY,
} from '../../constants';

interface JwtPayload {
  exp: number; // Expiration time (in seconds since Unix epoch)
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    // console.log('Current JWT expiration is: ', new Date(exp * 1000));
    const currentTime = Date.now() / 1000;
    return exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const signOut = () => {
  // Clear tokens and user data from localStorage
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
};
