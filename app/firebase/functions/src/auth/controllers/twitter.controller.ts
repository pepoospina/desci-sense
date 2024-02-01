import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import {
  TokenVerifier,
  checkTwitterVerifierToken,
  getTwitterOauthToken,
} from '../twitter.auth.utils';
import { verifierCodeScheme } from './auth.schemas';

export const getTwitterCodeController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = (request as any).userId;
    if (!userId) {
      response.status(403).send({});
      return;
    }

    let oauth_token = await getTwitterOauthToken(userId);
    response.status(200).send({ success: true, oauth_token });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};

export const postTwitterVerifierController: RequestHandler = async (
  request,
  response
) => {
  try {
    const userId = (request as any).userId;
    if (!userId) {
      response.status(403).send({});
      return;
    }

    const payload = (await verifierCodeScheme.validate(
      request.body
    )) as TokenVerifier;

    let twitter_user = await checkTwitterVerifierToken(userId, payload);
    logger.debug('twitter user', { twitter_user });
    response.status(200).send({ success: true, twitter_user });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
