import { Album } from '../types';

export function millisecondsToDuration(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Number(((milliseconds % 60000) / 1000).toFixed(0));

  return seconds === 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export function resolveAlbumToTrack(track: Album) {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists,
    images: track.images,
    release_date: track.release_date,
    spotify_uri: 'spotify:track:' + track.id,
  };
}
