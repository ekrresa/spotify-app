export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    }
  ];
  product: string;
  type: string;
  uri: string;
}

export interface NewReleases {
  albums: {
    href: string;
    items: Album[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
}

export interface Artist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface TrackImage {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: 'album' | 'single';
  artists: Artist[];
  href: string;
  id: string;
  images: TrackImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: 1;
  type: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  images: TrackImage[];
  release_date: string;
  spotify_uri: string;
}

export interface Search {
  tracks: {
    href: string;
    items: Array<{
      album: Album;
      artists: Array<{
        id: string;
        name: string;
      }>;
      duration_ms: number;
      id: string;
      name: string;
    }>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
}
