import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';
import { postsValidationScheme } from './posts.schemas';
import { PostCreate } from '../../types';

export const postsController: RequestHandler = async (request,
  response) => {
    const payload = (await postsValidationScheme.validate(
      request.body
    )) as PostCreate;

    logger.info({payload})

    try {
      response.status(200).send({ success: true });
    } catch (error: any) {
      logger.error('error', error);
      response.status(500).send({ success: false, error: error.message });
    }
  
  }
