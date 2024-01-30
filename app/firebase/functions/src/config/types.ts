import { ENVIRONMENTS } from './ENVIRONMENTS';

export interface Env {
  environment: ENVIRONMENTS;
  ORCID_CLIENT_ID: string;
  ORCID_SECRET: string;
}
