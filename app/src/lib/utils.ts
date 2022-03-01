import { AlbumTrack, SearchedRecord, Track } from '../types';

export function millisecondsToDuration(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));

  return seconds === 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export function resolveTrackToSong(track: AlbumTrack): Track {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists,
    images: track.album.images,
    release_date: track.album.release_date,
    spotify_uri: track.uri,
  };
}

export function resolveSearchToSong(result: SearchedRecord) {
  return {
    id: result.id,
    name: result.name,
    artists: result.artists,
    images: result.album.images,
    release_date: result.album.release_date,
    spotify_uri: 'spotify:track:' + result.id,
  };
}
