import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { CollectionNames } from '../@webapp/firestore/collectionNames';

initializeApp();

export const db = getFirestore();

export const collections = {
  users: db.collection(CollectionNames.Users),
};
