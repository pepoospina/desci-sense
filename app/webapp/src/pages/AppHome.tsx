import { useTranslation } from 'react-i18next';

import { useAccountContext } from '../app/AccountContext';
import { AppConnectWidget } from '../app/AppConnectButton';
import { useTwitterContext } from '../app/TwitterContext';
import { ViewportPage } from '../app/Viewport';
import { AppButton, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';

export const AppHome = (props: {}) => {
  const { t } = useTranslation();
  const { isConnected } = useAccountContext();
  const { twitterUser, connect: connectTwitter } = useTwitterContext();

  const content = (() => {
    if (isConnected && !twitterUser)
      return (
        <AppButton
          primary
          onClick={() => connectTwitter()}
          label={t('Connect Twitter/X')}></AppButton>
      );

    if (!isConnected) return <AppConnectWidget></AppConnectWidget>;

    return <AppHeading level="3">Ready!</AppHeading>;
  })();

  return (
    <ViewportPage
      content={<BoxCentered>{content}</BoxCentered>}
      nav={<></>}></ViewportPage>
  );
};
