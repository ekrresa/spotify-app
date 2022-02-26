import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAuthClient } from '../lib/request';

export function useAuth(code: string) {
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState<number>();
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    (async function getAccessToken() {
      if (!code) return;

      try {
        const response = await axiosAuthClient.post('/access_token', {
          code,
          redirect_uri: 'http://localhost:3000/login/',
        });

        setRefreshToken(response.data.refresh_token);
        setExpiresIn(response.data.expires_in);
        navigate('/');
      } catch (error: any) {
        setAuthError(error.message);
      }
    })();
  }, [code, navigate]);

  useEffect(() => {
    (async function refreshAccessToken() {
      if (!refreshToken || !expiresIn) {
        return;
      }

      let interval = setInterval(() => {
        axiosAuthClient
          .post('/refresh_token', { refresh_token: refreshToken })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            // logout the user
            console.log(error.message);
          });
      }, (expiresIn - 60) * 1000); // refresh the access token 1min before it expires

      return () => clearInterval(interval);
    })();
  }, [refreshToken, expiresIn]);

  return authError;
}
