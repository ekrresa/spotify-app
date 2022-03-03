# Spotify App

This app consumes the Spotify API and uses Firebase functions for the authentication with the Spotify API.  
State management was handled with Redux. Storage was handled by Firestore.

## Development

To run locally, you need to have created an account with Spotify and Google.
Login to the Spotify Developers dashboard to get your client id and secret.
Create a project on Firebase and setup a web app.

1. Clone the repo.
2. Install dependencies in the `app` and `functions` folder.
3. Add env variables as stated in the env.example file
4. Deploy the functions by running `npm run deploy` in the `functions` directory.
5. Run the app by running `npm start` in the `app` directory.
