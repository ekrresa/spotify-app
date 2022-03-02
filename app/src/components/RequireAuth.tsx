import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header />
      {children}
      <MobileNav />
    </>
  );
}
