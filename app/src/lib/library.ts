import { AxiosResponse } from 'axios';
import arrayDiff from 'lodash.difference';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  setDoc,
  query,
  getDoc,
} from 'firebase/firestore';
import { axiosSpotifyClient } from './request';
import { db } from './firebase';
import { NewPlaylist, PlaylistItems, Track } from '../types';

export async function addToLibrary(userId: string, track: Track) {
  try {
    const libraryRef = collection(db, 'spotify-app');
    const trackRef = doc(libraryRef, userId, 'library', track.id);
    await setDoc(trackRef, track);
    return { data: true };
  } catch (e: any) {
    console.error('Error saving to library', e.message);
    return { error: e.message };
  }
}

export async function getUserLibrary(userId: string) {
  try {
    const libraryQuery = query(
      collection(db, 'spotify-app', userId, 'library'),
      orderBy('name')
    );
    const querySnapshot = await getDocs(libraryQuery);
    let result: any[] = [];
    querySnapshot.forEach(doc => {
      result.push(doc.data());
    });

    return { data: result };
  } catch (error: any) {
    console.error('Error fetching library', error.message);
    return { error: error.message };
  }
}

export async function removeTrackFromLibrary(userId: string, trackId: string) {
  try {
    const docRef = doc(db, 'spotify-app', userId, 'library', trackId);
    await deleteDoc(docRef);

    return { data: true };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
}

export async function savePlaylist(userId: string, playlist: NewPlaylist) {
  await setDoc(doc(db, 'spotify-app', userId, 'playlists', 'playlist'), playlist);
}

export async function getUserPlaylist(userId: string) {
  const docRef = doc(db, 'spotify-app', userId, 'playlists', 'playlist');
  const docSnap = await getDoc(docRef);

  return docSnap.data() as NewPlaylist | undefined;
}

export async function createPlaylist(accessToken: string, userId: string) {
  const newPlaylistResponse = await axiosSpotifyClient.post<
    any,
    AxiosResponse<NewPlaylist>
  >(
    `/users/${userId}/playlists`,
    { name: 'Kool Jams' },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return newPlaylistResponse.data;
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[]
) {
  const response = await axiosSpotifyClient.post<
    any,
    AxiosResponse<{ snapshot_id: string }>
  >(
    `/playlists/${playlistId}/tracks`,
    { uris },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return response.data;
}

export async function getPlaylistTracks(accessToken: string, playlistId: string) {
  const response = await axiosSpotifyClient.get<PlaylistItems>(
    `/playlists/${playlistId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return response.data.items.map(item => item.track.uri);
}

interface PlaylistProps {
  accessToken: string | null;
  uris: string[];
  userId: string;
}
export async function addLibraryToPlaylist({ accessToken, uris, userId }: PlaylistProps) {
  // check if user has a playlist stored in firebase
  // if yes, retrieve the playlist id and add tracks to playlist in Spotify
  // Else, create a new playlist in spotify, store the playlist id in Firebase,
  // and add the tracks to the library
  try {
    const playlist = await getUserPlaylist(userId);

    if (!playlist) {
      const playlist = await createPlaylist(accessToken!, userId);
      await savePlaylist(userId, playlist);
      const result = await addTracksToPlaylist(accessToken!, playlist.id, uris);
      return { data: result };
    }

    const savedUris = await getPlaylistTracks(accessToken!, playlist?.id);
    const diffedUris = arrayDiff(uris, savedUris);

    if (diffedUris.length === 0) throw new Error('All tracks have been exported');

    const result = await addTracksToPlaylist(accessToken!, playlist?.id, diffedUris);
    return { data: result };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
}
