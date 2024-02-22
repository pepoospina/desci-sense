import { NpProfile } from '@nanopub/sign';

import { AppUserRead } from '../shared/types';
import { RSAKeys } from '../utils/rsa.keys';

export const NANOPUB_PLACEHOLDER = 'http://purl.org/nanopub/temp/mynanopub';
export const NANOPUB_SCHEMA = 'http://www.nanopub.org/nschema#';
export const COSMO_SCHEMA = 'https://sense-nets.xyz/';
export const ORCID_URL = 'https://orcid.org/';

export const ASSERTION_GRAPH = `${NANOPUB_PLACEHOLDER}#assertion`;
export const PROVENANCE_GRAPH = `${NANOPUB_PLACEHOLDER}#provenance`;
export const PUBINFO_GRAPH = `${NANOPUB_PLACEHOLDER}#pubinfo`;
export const HEAD_GRAPH = `${NANOPUB_PLACEHOLDER}#head`;

export const IS_A = `https://www.w3.org/1999/02/22-rdf-syntax-ns#type`;

export const HAS_COMMENT_URI = 'https://www.w3.org/2000/01/rdf-schema#comment';

export const getProfile = (rsaKeys: RSAKeys, connectedUser: AppUserRead) => {
  if (connectedUser.orcid) {
    const keyBody = rsaKeys.privateKey
      .replace(/-----BEGIN PRIVATE KEY-----\n?/, '')
      .replace(/\n?-----END PRIVATE KEY-----/, '')
      .replace(/\r/g, '')
      .replace(/\n/g, '');

    return new NpProfile(
      keyBody,
      `https://orcid.org/${connectedUser.orcid.orcid}`,
      `${connectedUser.orcid.name}`,
      ''
    );
  }
};
