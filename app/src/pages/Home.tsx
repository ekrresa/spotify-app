import {
  useAddToLibraryMutation,
  useGetNewReleasesQuery,
  useGetUserProfileQuery,
} from '../store/spotifyAPI';
import { IoAddCircle } from 'react-icons/io5';

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

      <section className="mt-10 container px-36">
        <h1 className="text-white font-semibold text-2xl mb-8">New Releases</h1>

        <div className="flex flex-wrap gap-x-6 gap-y-20">
          {newReleases.data?.albums.items.map(album => (
            <div key={album.id} className="flex-1 basis-52 rounded">
              <img src={album.images[0].url} className="rounded object-cover" alt="" />
              <div className="flex justify-between items-center px-1">
                <div className="mt-2">
                  <p className="text-sm truncate mt-1 font-medium">{album.name}</p>
                  <p className="truncate mt-[0.1rem] text-sm text-[#b4b4b4]">
                    {new Intl.ListFormat('en', { style: 'short' }).format(
                      album.artists.map(artist => artist.name)
                    )}
                  </p>
                </div>

                <button
                  className="pl-2"
                  onClick={() => trigger(resolveAlbumToTrack(album))}
                >
                  <IoAddCircle className="text-3xl fill-green" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
