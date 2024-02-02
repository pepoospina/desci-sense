export interface AppUser {
  userId: string;
  orcid?: {
    orcid: string;
    name: string;
  };
  twitter?: {
    oauth_token?: string;
    oauth_token_secret?: string;
    oauth_verifier?: string;
    accessToken?: string;
    accessSecret?: string;
    user_id?: string;
    screen_name?: string;
  };
}

export interface AppUserRead {
  userId: string;
  orcid?: {
    orcid: string;
    name: string;
  };
  twitter?: {
    user_id: string;
    screen_name: string;
  };
}

export type DefinedIfTrue<V, R> = V extends true ? R : R | undefined;

export interface TwitterUser {
  user_id: string;
  screen_name: string;
}

export enum PLATFORM {
  X = 'X',
  Nanopubs = 'Nanopubs',
}

export interface PostCreate {
  content: string;
  platforms: [PLATFORM];
}
