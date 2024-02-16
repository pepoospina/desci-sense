import { Box } from 'grommet';
import { useTranslation } from 'react-i18next';

import { useNanopubContext } from '../app/NanopubContext';
import { useTwitterContext } from '../app/TwitterContext';
import { AppButton } from '../ui-components';

export const AppPlatformManager = (props: {}) => {
  const { t } = useTranslation();
  const {
    connect: connectTwitter,
    isConnecting: isConnectingTwitter,
    needAuthorize: needAuthorizeTwitter,
  } = useTwitterContext();

  const {
    connect: connectNanopub,
    isConnecting: isConnectingNanopub,
    needAuthorize: needAuthorizeNanopub,
  } = useNanopubContext();

  return (
    <Box>
      <AppButton
        primary
        disabled={!needAuthorizeNanopub}
        loading={isConnectingNanopub}
        onClick={() => connectNanopub()}
        label={
          needAuthorizeNanopub ? t('connectNanopub') : t('nanopubConnected')
        }></AppButton>

      <AppButton
        primary
        disabled={!needAuthorizeTwitter}
        loading={isConnectingTwitter}
        onClick={() => connectTwitter()}
        label={
          needAuthorizeTwitter ? t('connectTwitter') : t('twitterConnected')
        }></AppButton>
    </Box>
  );
};
