import { IoRemoveCircle } from 'react-icons/io5';
import { Header } from '../components/Header';
import {
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

  return (
    <>
      <Header />

      <section className="container px-32 mt-10">
        <h1 className="mb-8 text-2xl">My Library</h1>

        <div className="flex flex-wrap gap-x-6 gap-y-20">
          {libraryQuery.data &&
            libraryQuery.data.map(track => (
              <div key={track.id} className="max-w-xs flex flex-col flex-1 basis-52">
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
                    <IoRemoveCircle className="text-3xl fill-green" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
