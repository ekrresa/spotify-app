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
    albumName: track.album.name,
    artists: track.artists,
    duration: track.duration_ms,
    images: track.album.images,
    name: track.name,
    release_date: track.album.release_date,
    spotify_uri: track.uri,
  };
}

export function resolveSearchToSong(result: SearchedRecord) {
  return {
    id: result.id,
    albumName: result.album.name,
    duration: result.duration_ms,
    name: result.name,
    artists: result.artists,
    images: result.album.images,
    release_date: result.album.release_date,
    spotify_uri: 'spotify:track:' + result.id,
  };
}
