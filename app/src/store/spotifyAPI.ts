import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { NewReleases, Search, Track, UserProfile } from '../types';
import type { RootState } from '.';
import { logout } from './authReducer';
import { addToLibrary, getUserLibrary } from '../lib/library';

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
  tagTypes: ['NewReleases', 'Search', 'Track', 'UserProfile'],
  endpoints: builder => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/me',
      keepUnusedDataFor: 86_400,
    }),
    getNewReleases: builder.query<NewReleases, string>({
      query: (country: string) =>
        `/browse/new-releases?country=${country}&offset=0&limit=10`,
      keepUnusedDataFor: 3600,
    }),
    searchTracks: builder.query<Search, string>({
      query: (text: string) => `/search?q=${text}&type=track`,
    }),
    addToLibrary: builder.mutation({
      queryFn: async (args, queryApi) => {
        const userProfile = (queryApi.getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;

        return await addToLibrary(userProfile, args);
      },
      invalidatesTags: ['Track'],
    }),
    getUserLibrary: builder.query<Track[], string>({
      queryFn: async args => {
        return await getUserLibrary(args);
      },
      keepUnusedDataFor: 3600,
      providesTags: ['Track'],
    }),
  }),
});

export const {
  useGetNewReleasesQuery,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
  useLazySearchTracksQuery,
  useAddToLibraryMutation,
} = spotifyAPI;
