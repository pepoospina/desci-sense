import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { postOrcidCode } from '../auth/auth.requests';
import { ORCID_CLIENT_ID, ORCID_REDIRECT_URL, ORCID_SERVER } from './config';

const DEBUG = true;

const ORCID_URL = `${ORCID_SERVER}/oauth/authorize?client_id=${ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${ORCID_REDIRECT_URL}`;

export type AccountContextType = {
  isConnected: boolean;
  isConnecting: boolean;
  disconnect: () => void;
  connect: () => void;
};

const AccountContextValue = createContext<AccountContextType | undefined>(
  undefined
);

/** Manages the authentication process */
export const AccountContext = (props: PropsWithChildren) => {
  const location = useLocation();
  const codeHandled = useRef(false);

  const [isConnected, setIsConnected] = useState<boolean>();

  // Extract the code from URL
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsConnected(true);
    } else {
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

        localStorage.setItem('token', token);
        checkToken();
      });
    }
  }, [code]);

  const disconnect = () => {
    if (DEBUG) console.log('disconnecting');
    localStorage.deleteItem('token');
    checkToken();
  };

  const connect = () => {
    window.location.href = ORCID_URL;
  };

  return (
    <AccountContextValue.Provider
      value={{
        isConnected: isConnected !== undefined ? isConnected : false,
        isConnecting: isConnected === undefined,
        connect,
        disconnect,
      }}>
      {props.children}
    </AccountContextValue.Provider>
  );
};

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
