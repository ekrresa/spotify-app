import axios, { AxiosError } from 'axios';
import { AlbumTrackResponse, NewReleases } from '../types';

export const axiosAuthClient = axios.create({
  baseURL: 'https://us-central1-fir-spotify-385c2.cloudfunctions.net/auth',
});

const axiosSpotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: { 'Content-Type': 'application/json' },
});

interface Props {
  accessToken: string | null;
  country: string;
  offset: number;
}
export async function getNewTracks({ accessToken, country, offset }: Props) {
  try {
    const albumResponse = await axiosSpotifyClient.get<NewReleases>(
      `/browse/new-releases?country=${country}&offset=${offset}&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const albums = albumResponse.data.albums.items.filter(
      album => album.album_type === 'single'
    );

    const tracksPromise = albums.map(async album => {
      const albumTracksResponse = await axiosSpotifyClient.get<AlbumTrackResponse>(
        `/albums/${album.id}/tracks`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const track = albumTracksResponse.data.items[0];
      return { ...track, album };
    });

    const tracks = await Promise.all(tracksPromise);
    return { data: tracks };
  } catch (axiosError) {
    let err = axiosError as AxiosError;
    return {
      error: err.response?.data,
    };
  }
}
