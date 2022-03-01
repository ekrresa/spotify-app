import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Track } from '../types';

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
    const querySnapshot = await getDocs(collection(db, 'spotify-app', userId, 'library'));
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
  console.log({ userId, trackId });
  try {
    const docRef = doc(db, 'spotify-app', userId, 'library', trackId);
    await deleteDoc(docRef);

    return { data: true };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
}
