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
import { TWITTER_API_URL } from './config';

const DEBUG = true;

export type TwitterContextType = {
  connect: () => void;
  twitterUser?: TwitterUser;
};

const TwitterContextValue = createContext<TwitterContextType | undefined>(
  undefined
);

/** Manages the authentication process */
export const TwitterContext = (props: PropsWithChildren) => {
  const { appAccessToken } = useAccountContext();
  const tokenHandled = useRef(false);
  const verifierHandled = useRef(false);

  const [oauthToken, setOauthToken] = useState<string>();

  const [searchParams, setSearchParams] = useSearchParams();
  const oauth_token_param = searchParams.get('oauth_token');
  const oauth_verifier_param = searchParams.get('oauth_verifier');

  const [twitterUser, setTwitterUser] = useState<TwitterUser>();

  const connect = () => {
    if (appAccessToken) {
      getTwitterAuthLink(appAccessToken).then((authLink) => {
        tokenHandled.current = true;
        window.location.href = authLink;
      });
    }
  };

  const checkConnected = () => {
    const twitter_user_str = localStorage.getItem('twitter_user');

    if (twitter_user_str !== null) {
      const twitter_user = JSON.parse(twitter_user_str);
      if (DEBUG) console.log('twitter found', twitter_user);
      setTwitterUser(twitter_user);
    } else {
      setTwitterUser(undefined);
    }
  };

  useEffect(() => {
    if (!tokenHandled.current && oauthToken) {
    }
  }, [oauthToken]);

  useEffect(() => {
    checkConnected();
  }, []);

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

        localStorage.setItem('twitter_user', JSON.stringify(twitter_user));
        checkConnected();
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
        twitterUser,
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
