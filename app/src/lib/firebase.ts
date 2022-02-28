// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC5QW3M_qdBbv8t5gO-3LyFaddga6PuOBo',
  authDomain: 'fir-spotify-385c2.firebaseapp.com',
  projectId: 'fir-spotify-385c2',
  storageBucket: 'fir-spotify-385c2.appspot.com',
  messagingSenderId: '1040306687110',
  appId: '1:1040306687110:web:fbd26a99b19a227eb2d507',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
