import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './pages/Login';
import { useAppDispatch, useAppSelector } from './store';
import { axiosAuthClient } from './lib/request';
import { logout, refreshAccessToken } from './store/authReducer';
import Library from './pages/Library';

export default function App() {
  const { refreshToken, expiresIn } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async function refreshAuthToken() {
      if (!refreshToken || !expiresIn) {
        return;
      }

      let interval = setInterval(() => {
        axiosAuthClient
          .post('/refresh_token', { refresh_token: refreshToken })
          .then(response => {
            dispatch(
              refreshAccessToken({
                accessToken: response.data.access_token,
                expiresIn: response.data.expires_in,
              })
            );
          })
          .catch(() => {
            dispatch(logout());
          });
      }, (expiresIn - 600) * 1000); // refresh the access token 10mins before it expires

      return () => clearInterval(interval);
    })();
  }, [dispatch, refreshToken, expiresIn]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/library"
          element={
            <RequireAuth>
              <Library />
            </RequireAuth>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
