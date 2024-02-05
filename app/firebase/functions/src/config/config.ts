import { env } from './env';

export const ORCID_API_URL = 'https://orcid.org';
export const ORCID_CLIENT_ID = env.ORCID_CLIENT_ID as string;
export const ORCID_SECRET = env.ORCID_SECRET as string;

export const TWITTER_API_URL = 'https://api.twitter.com';
export const TWITTER_CLIENT_ID = env.TWITTER_CLIENT_ID as string;
export const TWITTER_BEARER_TOKEN = env.TWITTER_BEARER_TOKEN as string;
export const TWITTER_API_KEY = env.TWITTER_API_KEY as string;
export const TWITTER_API_SECRET_KEY = env.TWITTER_API_SECRET_KEY as string;

export const TWITTER_CALLBACK_URL = 'http://127.0.0.1:3000/';

export const SENSENET_DOMAIN = 'http://127.0.0.1:3000/';

export const TOKEN_EXPIRATION = '30d';

export const REGION = 'us-central1';

if (!ORCID_CLIENT_ID) throw new Error('ORCID_CLIENT_ID undefined');
if (!ORCID_SECRET) throw new Error('ORCID_SECRET undefined');
if (!TWITTER_CLIENT_ID) throw new Error('TWITTER_CLIENT_ID undefined');
if (!TWITTER_BEARER_TOKEN) throw new Error('TWITTER_BEARER_TOKEN undefined');
if (!TWITTER_API_KEY) throw new Error('TWITTER_API_KEY undefined');
if (!TWITTER_API_SECRET_KEY)
  throw new Error('TWITTER_API_SECRET_KEY undefined');