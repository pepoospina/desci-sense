import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { postOrcidCode } from '../auth/auth.requests';
import { ConnectedUser } from '../types';
import { TwitterContext } from './TwitterContext';
import { ORCID_API_URL, ORCID_CLIENT_ID, ORCID_REDIRECT_URL } from './config';

const DEBUG = true;

const ORCID_LOGIN_URL = `${ORCID_API_URL}/oauth/authorize?client_id=${ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${ORCID_REDIRECT_URL}`;

type JWT_PAYLOAD = JwtPayload & ConnectedUser;

export type AccountContextType = {
  isConnected: boolean;
  isConnecting: boolean;
  disconnect: () => void;
  connect: () => void;
  connectedUser?: ConnectedUser;
  appAccessToken?: string;
};

const AccountContextValue = createContext<AccountContextType | undefined>(
  undefined
);

/** Manages the authentication process */
export const AccountContext = (props: PropsWithChildren) => {
  const codeHandled = useRef(false);

  const [isConnected, setIsConnected] = useState<boolean>();
  const [connectedUser, setConnectedUser] = useState<ConnectedUser>();
  const [token, setToken] = useState<string>();

  // Extract the code from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get('code');

  const checkToken = () => {
    const token = localStorage.getItem('token');

    if (token !== null) {
      const decoded = jwtDecode(token) as JWT_PAYLOAD;
      if (DEBUG) console.log('user from token', { decoded });

      setToken(token);
      setConnectedUser(decoded);
      setIsConnected(true);
    } else {
      setToken(undefined);
      setConnectedUser(undefined);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (!codeHandled.current && code) {
      codeHandled.current = true;
      if (DEBUG) console.log('code received', { code });

      postOrcidCode(code).then((token) => {
        if (DEBUG)
          console.log('token received (sliced)', { token: token.slice(0, 8) });

        searchParams.delete('code');
        setSearchParams(searchParams);
        localStorage.setItem('token', token);
        checkToken();
      });
    }
  }, [code]);

  const disconnect = () => {
    if (DEBUG) console.log('disconnecting');
    localStorage.removeItem('token');
    localStorage.removeItem('twitter_user');
    checkToken();
  };

  const connect = () => {
    window.location.href = ORCID_LOGIN_URL;
  };

  return (
    <AccountContextValue.Provider
      value={{
        isConnected: isConnected !== undefined ? isConnected : false,
        isConnecting: isConnected === undefined,
        connect,
        disconnect,
        connectedUser,
        appAccessToken: token,
      }}>
      <TwitterContext>{props.children}</TwitterContext>
    </AccountContextValue.Provider>
  );
};

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
