import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { PostCreate } from '../../types';
import { postsValidationScheme } from './posts.schemas';

export const postsController: RequestHandler = async (request, response) => {
  try {
    const payload = (await postsValidationScheme.validate(
      request.body
    )) as PostCreate;

    logger.info({ payload });

    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
