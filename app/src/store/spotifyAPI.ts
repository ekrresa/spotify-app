import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { AlbumTrack, SearchResult, Track, UserProfile } from '../types';
import type { RootState } from '.';
import { logout } from './authReducer';
import {
  addLibraryToPlaylist,
  addToLibrary,
  getUserLibrary,
  removeTrackFromLibrary,
} from '../lib/library';
import { getNewTracks } from '../lib/library';

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
  tagTypes: ['Track', 'NewReleases', 'SearchResult', 'Track', 'UserProfile'],
  keepUnusedDataFor: 3600,
  endpoints: builder => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/me',
      keepUnusedDataFor: 86_400,
    }),
    getNewReleases: builder.query<AlbumTrack[], { country: string }>({
      queryFn: async (args, queryApi) => {
        const accessToken = (queryApi.getState() as RootState).auth.accessToken as string;
        return await getNewTracks({ ...args, accessToken });
      },
    }),
    searchTracks: builder.query<SearchResult, string>({
      query: (text: string) => `/search?q=${text}&type=track`,
      providesTags: ['SearchResult'],
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

        return await addToLibrary(userProfile.id, args);
      },
      onQueryStarted: async (payload, { dispatch, getState, queryFulfilled }) => {
        const user = (getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;
        const patchResult = dispatch(
          spotifyAPI.util.updateQueryData('getUserLibrary', user.id, draft => {
            draft.push(payload);
            draft.sort((a, b) => {
              const songA = a.name.toLowerCase();
              const songB = b.name.toLowerCase();

              if (songA < songB) {
                return -1;
              }
              if (songA > songB) {
                return 1;
              }
              return 0;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeFromLibrary: builder.mutation({
      queryFn: async (args, queryApi) => {
        const userProfile = (queryApi.getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;

        return await removeTrackFromLibrary(userProfile.id, args);
      },
      onQueryStarted: async (payload, { dispatch, getState, queryFulfilled }) => {
        const user = (getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;
        const patchResult = dispatch(
          spotifyAPI.util.updateQueryData('getUserLibrary', user.id, draft => {
            const index = draft.findIndex(song => song.id === payload);
            draft.splice(index, 1);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    exportPlaylist: builder.mutation({
      queryFn: async (args, queryApi) => {
        const accessToken = (queryApi.getState() as RootState).auth.accessToken as string;
        const user = (queryApi.getState() as RootState).spotifyApi.queries[
          'getUserProfile(undefined)'
        ]?.data as UserProfile;

        return await addLibraryToPlaylist({ accessToken, userId: user.id, ...args });
      },
    }),
  }),
});

export const {
  useGetNewReleasesQuery,
  useGetUserLibraryQuery,
  useGetUserProfileQuery,
  useLazySearchTracksQuery,
  useAddToLibraryMutation,
  useExportPlaylistMutation,
  useRemoveFromLibraryMutation,
} = spotifyAPI;
