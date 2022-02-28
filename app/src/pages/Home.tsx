import {
  useAddToLibraryMutation,
  useGetNewReleasesQuery,
  useGetUserProfileQuery,
} from '../store/spotifyAPI';
import { AiOutlineUser } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { logout } from '../store/authReducer';
import { Search } from '../components/Search';
import { resolveAlbumToTrack } from '../lib/utils';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data } = useGetUserProfileQuery();
  const newReleases = useGetNewReleasesQuery(data?.country ?? '', {
    skip: !Boolean(data?.country),
  });
  const [trigger] = useAddToLibraryMutation();

  return (
    <div className="container">
      <header className="py-6 flex items-center">
        <div className="rounded-full w-10 h-10 bg-gray-400 grid place-items-center">
          <AiOutlineUser />
        </div>
        <p className="ml-4">{data?.display_name}</p>

        <Search />

        <Link to="/library" className="text-cyan-400 font-medium">
          My Library
        </Link>
        <button className="ml-4" onClick={() => dispatch(logout())}>
          <FiLogOut className="text-2xl" />
        </button>
      </header>

      <section className="mt-10">
        <div className="flex items-baseline">
          <h2 className="text-white font-semibold text-2xl">New Releases</h2>
          <Link
            to="/releases"
            className="ml-8 text-xs font-medium inline-block uppercase"
          >
            see all
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {newReleases.data?.albums.items.map(album => (
            <div key={album.id} className="h-80 flex-1 basis-52 rounded">
              <img src={album.images[0].url} className="rounded object-cover" alt="" />
              <p className="text-[0.8rem] mt-1 font-medium">{album.name}</p>
              <button
                className="bg-green text-xs flex items-center rounded-md px-2 py-1 mt-2"
                onClick={() => trigger(resolveAlbumToTrack(album))}
              >
                <BiPlus className="text-lg" />
                <span>Save to Library</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
