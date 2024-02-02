import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getTwitterAuthLink,
  postTwitterVerifierToken,
} from '../auth/auth.requests';
import { TwitterUser } from '../types';
import { useAccountContext } from './AccountContext';

const DEBUG = true;

export type TwitterContextType = {
  connect: () => void;
  needAuthorize?: boolean;
};

const TwitterContextValue = createContext<TwitterContextType | undefined>(
  undefined
);

/** Manages the authentication process */
export const TwitterContext = (props: PropsWithChildren) => {
  const {
    appAccessToken,
    connectedUser,
    refresh: refreshConnectedUser,
  } = useAccountContext();
  const tokenHandled = useRef(false);
  const verifierHandled = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const oauth_token_param = searchParams.get('oauth_token');
  const oauth_verifier_param = searchParams.get('oauth_verifier');

  /**
   * only ask authorization if twitter user not found locally nor
   * found in the backend
   */
  const [needAuthorize, setNeedAuthorize] = useState<boolean>();

  const connect = () => {
    if (appAccessToken) {
      getTwitterAuthLink(appAccessToken).then((authLink) => {
        tokenHandled.current = true;
        window.location.href = authLink;
      });
    }
  };

  useEffect(() => {
    if (connectedUser && connectedUser.twitter === undefined) {
      setNeedAuthorize(true);
    }
  }, [connectedUser]);

  /** Listen to oauth verifier to send it to the backend */
  useEffect(() => {
    if (
      !verifierHandled.current &&
      oauth_token_param &&
      oauth_verifier_param &&
      appAccessToken
    ) {
      verifierHandled.current = true;

      postTwitterVerifierToken(appAccessToken, {
        oauth_verifier: oauth_verifier_param,
        oauth_token: oauth_token_param,
      }).then((twitter_user: TwitterUser) => {
        if (DEBUG) console.log('twitter connected', twitter_user);

        searchParams.delete('oauth_token');
        searchParams.delete('oauth_verifier');
        setSearchParams(searchParams);

        refreshConnectedUser();
      });
    }
  }, [
    appAccessToken,
    oauth_token_param,
    oauth_verifier_param,
    searchParams,
    setSearchParams,
  ]);

  return (
    <TwitterContextValue.Provider
      value={{
        connect,
        needAuthorize,
      }}>
      {props.children}
    </TwitterContextValue.Provider>
  );
};

export const useTwitterContext = (): TwitterContextType => {
  const context = useContext(TwitterContextValue);
  if (!context) throw Error('context not found');
  return context;
};
