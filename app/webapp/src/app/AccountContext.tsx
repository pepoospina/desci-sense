import { PropsWithChildren, createContext, useContext } from 'react';

const DEBUG = true;

export type AccountContextType = {
  isConnected: boolean;
  disconnect: () => void;
};

const AccountContextValue = createContext<AccountContextType | undefined>(
  undefined
);

/** Manages the AA user ops and their execution */
export const AccountContext = (props: PropsWithChildren) => {
  const isConnected = false;
  const disconnect = () => {};

  return (
    <AccountContextValue.Provider
      value={{
        isConnected,
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
