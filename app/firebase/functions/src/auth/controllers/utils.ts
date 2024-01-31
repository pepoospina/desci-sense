import * as jwt from 'jsonwebtoken';

import { env } from '../../config/env';

export function generateAccessToken(orcid: string, expiresIn: string) {
  return jwt.sign({ orcid }, env.TOKEN_SECRET, { expiresIn });
}
