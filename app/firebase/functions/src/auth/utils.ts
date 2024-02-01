import * as crypto from 'crypto-js';
import { logger } from 'firebase-functions/v1';

import {
  ORCID_API_URL,
  ORCID_CLIENT_ID,
  ORCID_SECRET,
  SENSENET_DOMAIN,
  TWITTER_API_URL,
  TWITTER_CALLBACK_URL_ENCODED,
} from '../config/config';
import { env } from '../config/env';

const OAuth = require('oauth-1.0a');

export const getAuthenticatedOrcidId = async (code: string) => {
  const params = new URLSearchParams();

  params.append('client_id', ORCID_CLIENT_ID);
  params.append('client_secret', ORCID_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', SENSENET_DOMAIN);

  const response = await fetch(`${ORCID_API_URL}/oauth/token`, {
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/x-www-form-urlencoded'],
    ],
    method: 'post',
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};

// Function to create the OAuth signature
export function createSignature(consumerKey: string, consumerSecret: string) {
  return OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string: string, key: string) {
      return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64);
    },
  });
}

interface TwitterRequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed?: string;
}

export const getTwitterOauthToken = async () => {
  const oauth = createSignature(
    env.TWITTER_API_KEY,
    env.TWITTER_API_SECRET_KEY
  );

  const request_data = {
    url: `${TWITTER_API_URL}/oauth/request_token`,
    method: 'POST',
    data: { oauth_callback: TWITTER_CALLBACK_URL_ENCODED },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));

  const response = await fetch(request_data.url, {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: request_data.method,
  });

  logger.debug('getting twitter oauth - response', { response });

  const dataEncoded = await response.text();

  if (!response.ok) {
    throw new Error(`Error: ${dataEncoded}`);
  }

  const data: TwitterRequestTokenResponse = dataEncoded
    .split('&')
    .reduce((acc: any, current) => {
      const [key, value] = current.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

  return data;
};
