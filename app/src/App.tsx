import { useEffect } from 'react';
import { Outlet, RouteObject, useRoutes } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store';
import { logout, refreshAccessToken } from './store/authReducer';
import Home from './pages/Home';
import Login from './pages/Login';
import Library from './pages/Library';
import { RequireAuth } from './components/RequireAuth';
import { axiosAuthClient } from './lib/request';

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

  return useRoutes(routes);
}

const routes: RouteObject[] = [
  { path: '/login', element: <Login /> },
  {
    element: (
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/library', element: <Library /> },
    ],
  },
];
