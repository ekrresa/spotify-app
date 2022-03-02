import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAuthClient } from '../lib/request';
import { login } from '../store/authReducer';
import { useAppDispatch } from '../store';

export function useAuth(code: string) {
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async function getAccessToken() {
      if (!code) return;

      try {
        const response = await axiosAuthClient.post('/access_token', {
          code,
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        });

        dispatch(
          login({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
          })
        );
        navigate('/');
      } catch (error: any) {
        setAuthError(error.message);
      }
    })();
  }, [code, dispatch, navigate]);

  return authError;
}
