import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';
import { authCodeScheme } from './auth.schemas';

export const authCodeController: RequestHandler = async (request,
  response) => {
    const payload = (await authCodeScheme.validate(
      request.body
    )) as { code: string};

    logger.info({payload})

    try {
      response.status(200).send({ success: true });
    } catch (error: any) {
      logger.error('error', error);
      response.status(500).send({ success: false, error: error.message });
    }
  
  }
