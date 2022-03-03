import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AiOutlineLoading } from 'react-icons/ai';
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
    <div className="container px-5 h-screen">
      <div className="pt-52 flex flex-col items-center py-4">
        <img src={Logo} className="w-[35rem] mx-auto" alt="Spotify Logo" />
        <a
          href={getAuthorizationUrl(state)}
          className="bg-green flex items-center mt-24 px-8 py-4 rounded-full uppercase"
          data-testid="login-btn"
        >
          <span>Login with Spotify</span>
          {Boolean(authCode) && !(authError || error) && (
            <AiOutlineLoading className=" ml-4 animate-spin text-xl text-white" />
          )}
        </a>
      </div>
    </div>
  );
}
