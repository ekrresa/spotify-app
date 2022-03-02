import qs from 'query-string';

export function getAuthorizationUrl(state: string) {
  const SPOTIFY_URL = 'https://accounts.spotify.com/authorize?';
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const scope = 'user-read-private user-read-email playlist-modify-public';

  const queryString = qs.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  });

  return SPOTIFY_URL + queryString;
}
