import axios from 'axios';

export const axiosAuthClient = axios.create({
  baseURL: 'https://us-central1-fir-spotify-385c2.cloudfunctions.net/auth',
});

export const axiosSpotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: { 'Content-Type': 'application/json' },
});
