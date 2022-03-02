import * as React from 'react';
import { IoRemoveCircle } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { AiOutlineLoading } from 'react-icons/ai';

import { millisecondsToDuration } from '../lib/utils';
import {
  useExportPlaylistMutation,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
  useRemoveFromLibraryMutation,
} from '../store/spotifyAPI';

export default function Library() {
  const profileQuery = useGetUserProfileQuery();
  const libraryQuery = useGetUserLibraryQuery(profileQuery.data?.id ?? '', {
    skip: !Boolean(profileQuery.data?.id),
  });
  const [trigger, { status: removeSongStatus }] = useRemoveFromLibraryMutation();
  const [exportTrigger, { status: exportLibraryStatus }] = useExportPlaylistMutation();

  React.useEffect(() => {
    if (exportLibraryStatus === 'fulfilled')
      toast.success('library export was successful');
    if (exportLibraryStatus === 'rejected') toast.error('Failed to export library');
  }, [exportLibraryStatus]);

  React.useEffect(() => {
    if (removeSongStatus === 'fulfilled') toast.success('song removed successfully');
    if (removeSongStatus === 'rejected')
      toast.error('Unable to remove song from your library');
  }, [removeSongStatus]);

  const uris = libraryQuery.data?.map(track => track.spotify_uri);

  return (
    <section className="mt-10 mx-auto max-w-7xl px-4 mb-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl">My Library</h1>
        <button
          className="bg-green flex items-center text-sm px-4 py-1 rounded-full"
          onClick={() => exportTrigger({ uris })}
        >
          <span> Export to Spotify</span>
          {exportLibraryStatus === 'pending' && (
            <AiOutlineLoading className=" ml-2 animate-spin text-sm text-white" />
          )}
        </button>
      </div>

      {libraryQuery.isLoading ? (
        <p className="text-center">Loading...</p>
      ) : libraryQuery.isError ? (
        <p className="text-center text-amber-600">
          There was an error while fetching your songs
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-y-8 pb-10 lg:px-4">
          {libraryQuery.data && libraryQuery.data.length ? (
            libraryQuery.data.map(track => (
              <div key={track.id} className="flex items-center">
                <div className="flex-1 min-w-[4rem] max-w-[4rem] md:max-w-[6rem] lg:max-w-[7rem]">
                  <img
                    src={track.images[0].url}
                    className="rounded object-cover"
                    alt=""
                  />
                </div>

                <div className="ml-4 flex flex-1 gap-x-2">
                  <div className="flex-1 truncate">
                    <p className="text-sm truncate mt-1 font-medium">{track.name}</p>
                    <div className="mt-[2px] flex items-center text-sm truncate text-[#b4b4b4]">
                      <p className="truncate">
                        {new Intl.ListFormat('en', { style: 'short' }).format(
                          track.artists.map(artist => artist.name)
                        )}
                      </p>

                      <span className="mx-2 hidden md:inline">&#8212;</span>
                      <p className="truncate hidden md:inline-block">{track.albumName}</p>

                      <span className="mx-1 hidden md:inline">&#8226;</span>
                      <p className="hidden md:inline-block">
                        {millisecondsToDuration(track.duration)}
                      </p>
                    </div>
                  </div>

                  <button onClick={() => trigger(track.id)}>
                    <IoRemoveCircle className="text-3xl fill-amber-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">
              It appears that you haven't added any songs to your library.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
