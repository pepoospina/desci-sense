import * as jwt from 'jsonwebtoken';

import { env } from '../../config/env';

export interface TokenData {
  orcid: string;
  name: string;
}

export function generateAccessToken(data: TokenData, expiresIn: string) {
  return jwt.sign(data, env.TOKEN_SECRET, { expiresIn });
}
