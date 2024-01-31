import { env } from './env';

export const ORCID_API = 'https://orcid.org';
export const ORCID_CLIENT_ID = env.ORCID_CLIENT_ID as string;
export const ORCID_SECRET = env.ORCID_SECRET as string;

export const SENSENET_DOMAIN = 'http://127.0.0.1:3000/';

export const TOKEN_EXPIRATION = '30d';

if (!ORCID_CLIENT_ID) throw new Error('ORCID_CLIENT_ID undefined');
if (!ORCID_SECRET) throw new Error('ORCID_SECRET undefined');
