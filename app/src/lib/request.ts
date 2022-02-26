import axios from 'axios';

export const axiosAuthClient = axios.create({
  baseURL: 'https://us-central1-fir-spotify-385c2.cloudfunctions.net/auth',
});
