import express from 'express';
import * as functions from 'firebase-functions';

import { RUNTIME_OPTIONS } from '../config/RUNTIME_OPTIONS';
import { app } from '../instances/app';
import { authCodeController } from './controllers/code.controller';
import { getTwitterCodeController } from './controllers/twitter.controller';

const authRouter = express.Router();

authRouter.post('/code', authCodeController);
authRouter.post('/twitter-code', getTwitterCodeController);

export const authApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(authRouter));
