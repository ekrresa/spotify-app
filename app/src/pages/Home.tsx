import {
  useAddToLibraryMutation,
  useGetNewReleasesQuery,
  useGetUserProfileQuery,
} from '../store/spotifyAPI';
import { BiPlus } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { resolveAlbumToTrack } from '../lib/utils';
import { Header } from '../components/Header';

export default function Home() {
  const { data } = useGetUserProfileQuery();
  const newReleases = useGetNewReleasesQuery(data?.country ?? '', {
    skip: !Boolean(data?.country),
  });
  const [trigger] = useAddToLibraryMutation();

  return (
    <>
      <Header />

      <div className="container">
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
    </>
  );
}
