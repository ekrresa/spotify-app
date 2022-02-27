export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  followers: {
    href: string;
    total: number;
  };
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

interface Album {
  album_type: 'album' | 'single';
  artists: [
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/4ovtyvs7j1jSmwhkBGHqSr';
      };
      href: 'https://api.spotify.com/v1/artists/4ovtyvs7j1jSmwhkBGHqSr';
      id: '4ovtyvs7j1jSmwhkBGHqSr';
      name: 'Olamide';
      type: 'artist';
      uri: 'spotify:artist:4ovtyvs7j1jSmwhkBGHqSr';
    },
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/1fYVmAFB7sC7eDoF3mJXla';
      };
      href: 'https://api.spotify.com/v1/artists/1fYVmAFB7sC7eDoF3mJXla';
      id: '1fYVmAFB7sC7eDoF3mJXla';
      name: 'Wande Coal';
      type: 'artist';
      uri: 'spotify:artist:1fYVmAFB7sC7eDoF3mJXla';
    }
  ];

  external_urls: {
    spotify: 'https://open.spotify.com/album/4TMywqUCETaHjCMralaz1p';
  };
  href: 'https://api.spotify.com/v1/albums/4TMywqUCETaHjCMralaz1p';
  id: '4TMywqUCETaHjCMralaz1p';
  images: [
    {
      height: 640;
      url: 'https://i.scdn.co/image/ab67616d0000b2733a4eb06702ccfd270ccac80f';
      width: 640;
    },
    {
      height: 300;
      url: 'https://i.scdn.co/image/ab67616d00001e023a4eb06702ccfd270ccac80f';
      width: 300;
    },
    {
      height: 64;
      url: 'https://i.scdn.co/image/ab67616d000048513a4eb06702ccfd270ccac80f';
      width: 64;
    }
  ];
  name: 'Hate Me';
  release_date: '2022-02-23';
  release_date_precision: 'day';
  total_tracks: 1;
  type: 'album';
  uri: 'spotify:album:4TMywqUCETaHjCMralaz1p';
}
