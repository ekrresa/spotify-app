import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { NewReleases, Search, UserProfile } from '../types';
import type { RootState } from '.';
import { logout } from './authReducer';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.spotify.com/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

const AppBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const spotifyAPI = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: AppBaseQuery,
  endpoints: builder => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/me',
    }),
    getNewReleases: builder.query<NewReleases, string>({
      query: (country: string) =>
        `/browse/new-releases?country=${country}&offset=0&limit=10`,
    }),
    searchTracks: builder.query<Search, string>({
      query: (text: string) => `/search?q=${text}&type=track`,
    }),
  }),
});

export const {
  useGetNewReleasesQuery,
  useGetUserProfileQuery,
  useLazySearchTracksQuery,
} = spotifyAPI;
