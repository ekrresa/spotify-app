import * as React from 'react';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import {
  useAddToLibraryMutation,
  useGetNewReleasesQuery,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
} from '../store/spotifyAPI';

import { resolveTrackToSong } from '../lib/utils';
import { Header } from '../components/Header';

export default function Home() {
  const [offset, setOffset] = React.useState(0);
  const { data } = useGetUserProfileQuery();
  const newReleases = useGetNewReleasesQuery(
    { country: data?.country ?? '', offset },
    {
      skip: !Boolean(data?.country),
    }
  );
  const libraryQuery = useGetUserLibraryQuery(data?.id ?? '', {
    skip: !Boolean(data?.id),
  });
  const [trigger] = useAddToLibraryMutation();

  return (
    <>
      <Header />

      <section className="mt-10 container px-36">
        <h1 className="text-white font-semibold text-2xl mb-8">New Releases</h1>

        <div className="grid grid-cols-releases gap-x-6 gap-y-20 pb-10">
          {newReleases.data?.map(track => (
            <div key={track.id} className="rounded">
              <img
                src={track.album.images[0].url}
                className="rounded object-cover"
                alt=""
              />
              <div className="flex justify-between items-center px-1">
                <div className="mt-2 truncate">
                  <p className="text-sm truncate mt-1 font-medium">{track.name}</p>
                  <p className="truncate mt-[0.1rem] text-sm text-[#b4b4b4]">
                    {new Intl.ListFormat('en', { style: 'short' }).format(
                      track.artists.map(artist => artist.name)
                    )}
                  </p>
                </div>

                {libraryQuery.data &&
                libraryQuery.data.some(song => song.id === track.id) ? (
                  <button
                    className="pl-2"
                    onClick={() => trigger(resolveTrackToSong(track))}
                  >
                    <IoRemoveCircle className="text-3xl fill-amber-500" />
                  </button>
                ) : (
                  <button
                    className="pl-2"
                    onClick={() => trigger(resolveTrackToSong(track))}
                  >
                    <IoAddCircle className="text-3xl fill-green" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
