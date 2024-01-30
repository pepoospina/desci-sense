import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';
import { authCodeScheme } from './auth.schemas';
import { getAuthenticatedOrcidId } from '../utils';

export const authCodeController: RequestHandler = async (request,
  response) => {
    const payload = (await authCodeScheme.validate(
      request.body
    )) as { code: string};

    logger.info({payload})

    const authenticatedUser = await getAuthenticatedOrcidId(payload.code)

    logger.info({authenticatedUser})

    try {
      response.status(200).send({ success: true });
    } catch (error: any) {
      logger.error('error', error);
      response.status(500).send({ success: false, error: error.message });
    }
  
  }
