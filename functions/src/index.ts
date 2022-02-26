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

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.status(200).send({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    });
  } catch (error: any) {
    functions.logger.info(error.message, { structuredData: true });
    res.status(401).send({ error: 'An error occurred' });
  }
});

app.post('/refresh_token', async (req, res) => {
  const refresh_token = req.body.refresh_token;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      },
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.status(200).send({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    });
  } catch (error: any) {
    functions.logger.info(error.message, { structuredData: true });
    res.status(401).send({ error: 'An error occurred' });
  }
});

exports.auth = functions.https.onRequest(app);
