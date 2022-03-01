import 'dotenv/config';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import axios from 'axios';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const app = express();

app.use(cors({ origin: true }));

app.post('/access_token', async (req, res) => {
  const { code, redirect_uri } = req.body;
  const params = new URLSearchParams();

  params.set('code', code);
  params.set('redirect_uri', redirect_uri);
  params.set('grant_type', 'authorization_code');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.status(200).send({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    functions.logger.info(error, { structuredData: true });
    res.status(401).send({ error: 'An error occurred' });
  }
});

app.post('/refresh_token', async (req, res) => {
  const refresh_token = req.body.refresh_token;
  const params = new URLSearchParams();

  params.set('grant_type', 'refresh_token');
  params.set('refresh_token', refresh_token);

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.status(200).send({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    functions.logger.info(error, { structuredData: true });
    res.status(401).send({ error: 'An error occurred' });
  }
});

exports.auth = functions.https.onRequest(app);
