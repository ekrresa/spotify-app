import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';

import { useAppDispatch } from '../store';
import { logout } from '../store/authReducer';
import { useGetUserProfileQuery } from '../store/spotifyAPI';
import { CustomLink } from './CustomLink';
import { Search } from './Search';

export function Header() {
  const dispatch = useAppDispatch();
  const profileQuery = useGetUserProfileQuery();

  return (
    <header>
      <div className="py-6 container flex items-center">
        <div className="rounded-full w-10 h-10 bg-gray-400 grid place-items-center">
          <AiOutlineUser />
        </div>
        <p className="ml-2 font-medium text-sm">{profileQuery.data?.display_name}</p>

        <div className="flex space-x-8 mx-auto items-center font-semibold text-lg">
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/library">Library</CustomLink>
          <Search />
        </div>

        <button className="ml-4" onClick={() => dispatch(logout())}>
          <FiLogOut className="text-2xl" />
        </button>
      </div>
    </header>
  );
}
