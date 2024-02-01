export interface ConnectedUser {
  orcid: string;
  name: string;
}

export interface AppUser {
  userId: string;
  twitter?: {
    oauth_token?: string;
    oauth_token_secret?: string;
    oauth_verifier?: string;
    oauth_token_access?: string;
    oauth_token_secret_access?: string;
    user_id?: string;
    screen_name?: string;
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
