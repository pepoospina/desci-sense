import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { PostCreate } from '../../@webapp/types';
import { postMessage } from '../../auth/twitter.auth.utils';
import { postsValidationScheme } from './posts.schemas';

export const postsController: RequestHandler = async (request, response) => {
  try {
    const userId = (request as any).userId;
    if (!userId) {
      response.status(403).send({});
      return;
    }
    const payload = (await postsValidationScheme.validate(
      request.body
    )) as PostCreate;

    const tweet = await postMessage(userId, payload);

    response.status(200).send({ success: true, tweet });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
