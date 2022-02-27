import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Logo from '../assets/Logo-white.png';
import { getAuthorizationUrl } from '../lib/auth';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [searchParams] = useSearchParams();
  const authError = searchParams.get('error');
  const authCode = searchParams.get('code');
  const state = 'e4fd9571-d547-40af-9a52-3ff20ed960e5';

  const error = useAuth(authCode ?? '');

  if (authError || error) {
    toast.error('An error occurred');
  }

  return (
    <div className="container h-screen">
      <div className="pt-52 text-center py-4">
        <img src={Logo} className="w-[35rem] mx-auto" alt="Spotify Logo" />
        <a
          href={getAuthorizationUrl(state)}
          className="bg-green inline-block  mt-24 px-8 py-3 rounded-full uppercase"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
}
