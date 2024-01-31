import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { TOKEN_EXPIRATION } from '../../config/config';
import { getAuthenticatedOrcidId } from '../utils';
import { authCodeScheme } from './auth.schemas';
import { generateAccessToken } from './utils';

export const authCodeController: RequestHandler = async (request, response) => {
  const payload = (await authCodeScheme.validate(request.body)) as {
    code: string;
  };

  const authenticatedUser = await getAuthenticatedOrcidId(payload.code);

  logger.debug('authenticated user', { authenticatedUser });
  let token;

  if (authenticatedUser && authenticatedUser.orcid) {
    /** user correctly authentiacated with orcid */
    token = generateAccessToken(authenticatedUser.orcid, TOKEN_EXPIRATION);
    logger.debug('token generated slice', { token: token.slice(0, 8) });
  }

  try {
    response.status(200).send({ success: true, token });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
