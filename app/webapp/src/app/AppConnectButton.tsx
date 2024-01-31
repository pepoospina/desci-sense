import { BoxExtendedProps } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { useEffect, useRef, useState } from  'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { postOrcidCode } from '../auth/auth.requests';
import { AppButton, AppHeading } from '../ui-components';
import { Loading } from '../ui-components/LoadingDiv';
import { useAccountContext } from './AccountContext';
import { ORCID_CLIENT_ID, ORCID_REDIRECT_URL, ORCID_SERVER } from './config';

const ORCID_URL = `${ORCID_SERVER}/oauth/authorize?client_id=${ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${ORCID_REDIRECT_URL}`;

export const AppConnectButton = (
  props: { label?: string } & BoxExtendedProps
) => {
  const { t } = useTranslation();
  const location = useLocation();
  const codeHandled = useRef(false);

  // Extract the code from URL
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    if (!codeHandled.current && code) {
      codeHandled.current = true;
      console.log({ code });
      postOrcidCode(code);
    }
  }, [code]);

  const connect = () => {
    window.location.href = ORCID_URL;
  };

  return (
    <AppButton
      style={{ ...props.style }}
      onClick={() => connect()}
      label={t('connectBtn')}
      primary></AppButton>
  );
};

export const AppConnectWidget = () => {
  const { t } = useTranslation();
  const { isConnected } = useAccountContext();

  const isLoading = false;

  if (!isConnected) {
    return (
      <>
        <AppHeading level="3" style={{ marginBottom: '18px' }}>
          {t('connectAccount')}
        </AppHeading>
        {isLoading ? (
          <Loading></Loading>
        ) : (
          <AppConnectButton></AppConnectButton>
        )}
      </>
    );
  }

  return (
    <>
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t('accountReady')}
      </AppHeading>
      <StatusGood size="48px" />
    </>
  );
};
