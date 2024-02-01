import * as crypto from 'crypto-js';
import { logger } from 'firebase-functions/v1';

import { PostCreate, TwitterUser } from '../@webapp/types';
import {
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  TWITTER_API_URL,
  TWITTER_CALLBACK_URL_ENCODED,
} from '../config/config';
import { getUser, setUser } from '../db/user.repo';

const OAuth = require('oauth-1.0a');

const apiCredentials: ApiCredentials = {
  key: TWITTER_API_KEY,
  secret: TWITTER_API_SECRET_KEY,
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

interface RequestData<T> {
  url: string;
  method: 'POST' | 'GET';
  data: T;
}

interface ApiCredentials {
  key: string;
  secret: string;
}

export const sendTwitterRequest = async <T, R>(
  requestData: RequestData<T>,
  appCredentials: ApiCredentials,
  userCredentials?: ApiCredentials
): Promise<R> => {
  const oauth = createSignature(appCredentials.key, appCredentials.secret);
  const headers = oauth.toHeader(oauth.authorize(requestData, userCredentials));

  const response = await fetch(requestData.url, {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: requestData.method,
  });

  logger.debug('getting twitter - response', { requestData, response });

  const dataEncoded = await response.text();

  if (!response.ok) {
    throw new Error(`Error: ${dataEncoded}`);
  }

  const data = dataEncoded.split('&').reduce((acc: any, current) => {
    const [key, value] = current.split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  return data;
};

interface RequestTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed?: string;
}

interface OAuthTokenRequest {
  oauth_callback: string;
}

export const getTwitterOauthToken = async (userId: string): Promise<string> => {
  const requestData: RequestData<OAuthTokenRequest> = {
    url: `${TWITTER_API_URL}/oauth/request_token`,
    method: 'POST',
    data: { oauth_callback: TWITTER_CALLBACK_URL_ENCODED },
  };

  const oauth = await sendTwitterRequest<
    OAuthTokenRequest,
    RequestTokenResponse
  >(requestData, apiCredentials);

  /** store user credentials */
  const user = await getUser(userId, true);

  user.twitter = {
    oauth_token: oauth.oauth_token,
    oauth_token_secret: oauth.oauth_token_secret,
  };

  await setUser(user);

  return oauth.oauth_token;
};

export interface TokenVerifier {
  oauth_token: string;
  oauth_verifier: string;
}

interface OAccessTokenRequest {
  oauth_verifier: string;
}

interface AccessTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
}

export const checkTwitterVerifierToken = async (
  userId: string,
  oauth: TokenVerifier
): Promise<TwitterUser> => {
  const user = await getUser(userId, true);

  if (!user.twitter || !user.twitter.oauth_token_secret) {
    throw new Error('Twitter credentials not found');
  }

  if (user.twitter.oauth_token !== oauth.oauth_token) {
    throw new Error(
      `User ${userId} oauth_token mismatch. "${oauth.oauth_token}" was expected to be "${user.twitter.oauth_token}" `
    );
  }

  const userCredentials: ApiCredentials = {
    key: user.twitter.oauth_token,
    secret: user.twitter.oauth_token_secret,
  };

  const requestData: RequestData<OAccessTokenRequest> = {
    url: `${TWITTER_API_URL}/oauth/access_token`,
    method: 'POST',
    data: { oauth_verifier: oauth.oauth_verifier },
  };

  const access = await sendTwitterRequest<
    OAccessTokenRequest,
    AccessTokenResponse
  >(requestData, apiCredentials, userCredentials);

  user.twitter.oauth_verifier = oauth.oauth_verifier;
  user.twitter.oauth_token_access = access.oauth_token;
  user.twitter.oauth_token_secret_access = access.oauth_token_secret;
  user.twitter.user_id = access.user_id;
  user.twitter.screen_name = access.screen_name;

  console.log({ access });

  /** store access credentials */
  await setUser(user);

  return {
    user_id: user.twitter.user_id,
    screen_name: user.twitter.screen_name,
  };
};

interface PostRequest {
  text: string;
}

interface PostResponse {}

export const postMessage = async (
  userId: string,
  post: PostCreate
): Promise<void> => {
  const user = await getUser(userId, true);

  if (
    !user.twitter ||
    !user.twitter.oauth_token_access ||
    !user.twitter.oauth_token_secret_access
  ) {
    throw new Error(`Twitter access credentials not found for user ${userId}`);
  }

  const userCredentials: ApiCredentials = {
    key: user.twitter.oauth_token_access,
    secret: user.twitter.oauth_token_secret_access,
  };

  const requestData: RequestData<PostRequest> = {
    url: `${TWITTER_API_URL}/2/tweets`,
    method: 'POST',
    data: { text: post.content },
  };

  const result = await sendTwitterRequest<PostRequest, PostResponse>(
    requestData,
    apiCredentials,
    userCredentials
  );

  console.log({ result });
};
