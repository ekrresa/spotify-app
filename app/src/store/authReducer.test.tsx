import authReducer, { login, logout, refreshAccessToken, AuthState } from './authReducer';

describe('Auth reducer', () => {
  const initialState: AuthState = {
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
    isAuthenticated: false,
  };

  test('should handle login', () => {
    const actual = authReducer(
      initialState,
      login({
        accessToken: 'logintoken',
        refreshToken: 'refreshToken',
        expiresIn: 3600,
        isAuthenticated: true,
      })
    );

    expect(actual.isAuthenticated).toBe(true);
    expect(actual.accessToken).toBe('logintoken');
    expect(actual.refreshToken).toBe('refreshToken');
    expect(actual.expiresIn).toBe(3600);
  });

  test('should handle logout', () => {
    const actual = authReducer(initialState, logout());

    expect(actual.isAuthenticated).toBe(false);
    expect(actual.accessToken).toBe(null);
    expect(actual.refreshToken).toBe(null);
    expect(actual.expiresIn).toBe(0);
  });

  test('should handle refreshing access token', () => {
    const actual = authReducer(
      initialState,
      refreshAccessToken({
        accessToken: 'newlogintoken',
        expiresIn: 5400,
      })
    );

    expect(actual.isAuthenticated).toBe(true);
    expect(actual.accessToken).toBe('newlogintoken');
    expect(actual.expiresIn).toBe(5400);
  });
});
