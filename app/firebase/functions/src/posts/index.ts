import express from 'express';
import * as functions from 'firebase-functions';
import { RUNTIME_OPTIONS } from '../config/RUNTIME_OPTIONS';
import { app } from '../instances/app';
import { postsController } from './controllers/posts.controller';

const postsRouter = express.Router();

postsRouter.post('/post', postsController);

export const postsApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(postsRouter));