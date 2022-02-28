import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '../types';

export async function addToLibrary(user: UserProfile, track: any) {
  try {
    const libraryRef = collection(db, 'spotify-app');
    const trackRef = doc(libraryRef, user.id, 'library', track.id);
    await setDoc(trackRef, track);
    return { data: true };
  } catch (e: any) {
    console.error('Error saving to library', e.message);
    return { error: e.message };
  }
}

export async function getUserLibrary(libraryId: string) {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'spotify-app', libraryId, 'library')
    );
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
