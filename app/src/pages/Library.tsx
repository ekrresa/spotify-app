import { IoRemoveCircle } from 'react-icons/io5';
import { Header } from '../components/Header';
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
  const [trigger] = useRemoveFromLibraryMutation();
  const [exportTrigger] = useExportPlaylistMutation();

  const uris = libraryQuery.data?.map(track => track.spotify_uri);

  return (
    <>
      <Header />

      <section className="mt-10 mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl">My Library</h1>
          <button
            className="bg-green text-sm px-4 py-1 rounded-full"
            onClick={() => exportTrigger({ uris })}
          >
            Export to Spotify
          </button>
        </div>

        <div className="grid grid-cols-releases gap-x-6 gap-y-20 pb-10">
          {libraryQuery.data &&
            libraryQuery.data.map(track => (
              <div key={track.id} className="max-w-xs flex flex-col basis-52">
                <img src={track.images[0].url} className="rounded object-cover" alt="" />
                <div className="flex justify-between items-center px-1">
                  <div className="mt-2">
                    <p className="text-sm truncate mt-1 font-medium">{track.name}</p>
                    <p className="truncate mt-[0.1rem] text-sm text-[#b4b4b4]">
                      {new Intl.ListFormat('en', { style: 'short' }).format(
                        track.artists.map(artist => artist.name)
                      )}
                    </p>
                  </div>

                  <button className="pl-2" onClick={() => trigger(track.id)}>
                    <IoRemoveCircle className="text-3xl fill-amber-500" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
