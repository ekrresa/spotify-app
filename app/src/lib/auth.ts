import qs from 'query-string';

export function getAuthorizationUrl(state: string) {
  const SPOTIFY_URL = 'https://accounts.spotify.com/authorize?';
  const client_id = '57d0aa753c1f43738fdb3b6a5f47d811';
  const redirect_uri = 'http://localhost:3000/login/';
  const scope = 'user-read-private user-read-email';

  const queryString = qs.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  });

  return SPOTIFY_URL + queryString;
}
