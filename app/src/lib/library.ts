import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '../types';

export async function addToLibrary(user: UserProfile, track: any) {
  try {
    const trackRef = doc(db, 'spotify-app', 'user-' + user.id, 'tracks', track.id);
    await setDoc(trackRef, track);
    return { data: true };
  } catch (e: any) {
    console.error('Error saving to library', e.message);
    return { error: e.message };
  }
}
