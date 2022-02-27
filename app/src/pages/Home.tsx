import { useAppSelector } from '../store/hooks';

export default function Home() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  console.log({ isAuthenticated });
  return <div className="container">Home</div>;
}
