import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { NewReleases, SearchResult, Track, UserProfile } from '../types';
import type { RootState } from '.';
import { logout } from './authReducer';
import { addToLibrary, getUserLibrary, removeTrackFromLibrary } from '../lib/library';

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
  tagTypes: ['NewReleases', 'SearchResult', 'Track', 'UserProfile'],
  keepUnusedDataFor: 3600,
  endpoints: builder => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/me',
      keepUnusedDataFor: 86_400,
    }),
    getNewReleases: builder.query<NewReleases, string>({
      query: (country: string) =>
        `/browse/new-releases?country=${country}&offset=0&limit=10`,
    }),
    searchTracks: builder.query<SearchResult, string>({
      query: (text: string) => `/search?q=track:${text}&type=track`,
    }),
    getUserLibrary: builder.query<Track[], string>({
      queryFn: async args => {
        return await getUserLibrary(args);
      },
      providesTags: ['Track'],
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
    removeFromLibrary: builder.mutation({
      queryFn: async (args, queryApi) => {
        const userProfile = (queryApi.getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;

        return await removeTrackFromLibrary(userProfile.id, args);
      },
      invalidatesTags: ['Track'],
    }),
  }),
});

export const {
  useGetNewReleasesQuery,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
  useLazySearchTracksQuery,
  useAddToLibraryMutation,
  useRemoveFromLibraryMutation,
} = spotifyAPI;
