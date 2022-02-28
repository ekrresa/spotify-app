import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose, IoAddCircle } from 'react-icons/io5';
import { millisecondsToDuration } from '../lib/utils';
import { useLazySearchTracksQuery } from '../store/spotifyAPI';
import { Modal } from './Modal';

export function Search() {
  const [text, setText] = React.useState('');
  const [trigger, { data }] = useLazySearchTracksQuery();

  return (
    <>
      <form
        className="mx-auto relative z-50 flex border border-gray-100 rounded-full pl-2 overflow-hidden items-center max-w-sm w-full"
        onSubmit={e => {
          e.preventDefault();
          trigger(encodeURIComponent(text));
        }}
      >
        <FiSearch className="text-xl" />
        <input
          className="ml-2 bg-inherit text-sm px-2 py-1 focus:outline-none flex-1"
          onChange={e => setText(e.currentTarget.value)}
          value={text}
          type="text"
        />
        <button
          className={`bg-green px-2 py-[0.3rem] text-sm font-medium transition-opacity duration-700 ease-in-out ${
            Boolean(text) ? 'opacity-100' : 'opacity-0'
          }`}
          type="submit"
        >
          search
        </button>
      </form>

      <Modal isOpen={Boolean(text)}>
        <div className="max-w-5xl px-4 mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Search results</h2>
            <button
              className="bg-slate-500 flex items-center px-2 py-1 rounded-full text-xs"
              onClick={() => setText('')}
            >
              <IoClose className="text-sm mr-1" />
              <span>Close</span>
            </button>
          </div>

          {data && (
            <div className="mt-12">
              {data.tracks.items.map(({ album, artists, duration_ms, id, name }) => (
                <div key={id} className="flex items-center mb-4 last:mb-0">
                  <img className="w-20 rounded" src={album.images[0].url} alt="" />
                  <div className="ml-6 text-sm">
                    <p className="text-sm font-semibold">{name}</p>

                    <div className="flex items-center font-medium text-[#b4b4b4]">
                      <p>
                        {new Intl.ListFormat('en', { style: 'short' }).format(
                          artists.map(artist => artist.name)
                        )}
                      </p>

                      <span className="mx-2">&#8212;</span>
                      <p>{album.name}</p>
                      <span className="mx-1">&#8226;</span>
                      <p>{millisecondsToDuration(duration_ms)}</p>
                    </div>
                  </div>

                  <button className="ml-auto">
                    <IoAddCircle className="text-3xl fill-green" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
