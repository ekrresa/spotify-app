import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose, IoAddCircle, IoSearch, IoRemoveCircle } from 'react-icons/io5';
import {
  useAddToLibraryMutation,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
  useLazySearchTracksQuery,
  useRemoveFromLibraryMutation,
} from '../store/spotifyAPI';
import { Modal } from './Modal';
import { millisecondsToDuration, resolveSearchToSong } from '../lib/utils';

export function Search() {
  const [text, setText] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [trigger, { data }] = useLazySearchTracksQuery();
  const profileQuery = useGetUserProfileQuery();
  const libraryQuery = useGetUserLibraryQuery(profileQuery.data?.id ?? '', {
    skip: !Boolean(profileQuery.data?.id),
  });
  const [addTrackTrigger] = useAddToLibraryMutation();
  const [removeTrackTrigger] = useRemoveFromLibraryMutation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <button
        className="flex items-center justify-center flex-1"
        onClick={() => setOpen(true)}
      >
        <IoSearch className="text-lg" />
        <p className="ml-1">Search</p>
      </button>

      <Modal isOpen={open}>
        <div className="py-4 bg-black">
          <form
            className="mx-auto flex items-center border border-gray-100 rounded-full pl-2 overflow-hidden max-w-sm w-full"
            onSubmit={e => {
              e.preventDefault();
              trigger(encodeURIComponent(text));
            }}
          >
            <FiSearch className="text-xl" />
            <input
              className="ml-2 bg-inherit text-sm px-2 py-2 focus:outline-none flex-1"
              onChange={e => setText(e.currentTarget.value)}
              value={text}
              ref={inputRef}
            />
            <button
              className={`bg-green px-2 py-[0.3rem] self-stretch text-sm font-medium transition-opacity duration-500 ease-in-out ${
                Boolean(text) ? 'opacity-100' : 'opacity-0'
              }`}
              type="submit"
            >
              search
            </button>
          </form>
        </div>
        <div className="max-w-5xl mt-4 mx-auto pb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Search results</h2>
            <button
              className="bg-slate-500 flex items-center px-2 py-1 rounded-full text-xs"
              onClick={() => setOpen(false)}
            >
              <IoClose className="text-sm mr-1" />
              <span>Close</span>
            </button>
          </div>

          {data && (
            <div className="mt-12">
              {data.tracks.items.map(({ album, artists, duration_ms, id, name }) => (
                <div key={id} className="flex items-center mb-4 last:mb-0">
                  <div className="flex-1 min-w-[4rem] max-w-[4rem] md:max-w-[6rem] lg:max-w-[7rem] rounded overflow-hidden">
                    <img src={album.images[0].url} alt="" />
                  </div>

                  <div className="flex-1 flex justify-between ml-4 gap-x-4">
                    <div className="text-sm flex-1 min-w-0 truncate">
                      <p className="text-sm font-semibold truncate">{name}</p>

                      <p className="flex items-center truncate font-medium max-w-3xl text-[#b4b4b4]">
                        <span>
                          {new Intl.ListFormat('en', { style: 'short' }).format(
                            artists.map(artist => artist.name)
                          )}
                        </span>

                        <span className="mx-2 hidden md:inline">&#8212;</span>
                        <span className="truncate hidden md:inline-block">
                          {album.name}
                        </span>

                        <span className="mx-1 hidden md:inline">&#8226;</span>
                        <span className="hidden md:inline-block">
                          {millisecondsToDuration(duration_ms)}
                        </span>
                      </p>
                    </div>

                    {libraryQuery.data &&
                    libraryQuery.data.some(track => track.id === id) ? (
                      <button className="shrink-0" onClick={() => removeTrackTrigger(id)}>
                        <IoRemoveCircle className="text-3xl fill-amber-500" />
                      </button>
                    ) : (
                      <button
                        className="shrink-0"
                        onClick={() =>
                          addTrackTrigger(
                            resolveSearchToSong({ album, artists, duration_ms, id, name })
                          )
                        }
                      >
                        <IoAddCircle className="text-3xl fill-green" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
