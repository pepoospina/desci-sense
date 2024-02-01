import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { getTwitterAuthToken } from '../auth/auth.requests';
import { useAccountContext } from './AccountContext';
import {
  TWITTER_API_URL_AUTH,
  TWITTER_CALLBACK_URL_ENCODED,
  TWITTER_CLIENT_ID,
} from './config';

const DEBUG = true;

const TWITTER_AUTHORIZE_URL = `${TWITTER_API_URL_AUTH}/oauth/request_token?oauth_consumer_key=${TWITTER_CLIENT_ID}&oauth_callback=${TWITTER_CALLBACK_URL_ENCODED}`;

export type TwitterContextType = {
  hasTwitter: boolean;
  connect: () => void;
};

const TwitterContextValue = createContext<TwitterContextType | undefined>(
  undefined
);

/** Manages the authentication process */
export const TwitterContext = (props: PropsWithChildren) => {
  const { token } = useAccountContext();
  const codeHandled = useRef(false);

  // Extract the code from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const oauth_token = searchParams.get('oauth_token');

  useEffect(() => {
    if (!codeHandled.current && oauth_token) {
      codeHandled.current = true;
      if (DEBUG) console.log('oauth_token received', { oauth_token });
    }
  }, [oauth_token]);

  const connect = () => {
    if (token) {
      getTwitterAuthToken(token).then((oauthToken) => {
        console.log({ oauthToken });
      });
    }
  };

  return (
    <TwitterContextValue.Provider
      value={{
        connect,
        hasTwitter: false,
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
