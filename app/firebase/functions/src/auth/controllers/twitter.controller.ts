import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { getTwitterOauthToken } from '../utils';

export const getTwitterCodeController: RequestHandler = async (
  request,
  response
) => {
  const userId = (request as any).userId;
  if (!userId) {
    response.status(403).send({});
    return;
  }

  try {
    let oauth_token = await getTwitterOauthToken();
    console.log({ oauth_token });
    response.status(200).send({ success: true, oauth_token });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
