import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAccountContext } from '../app/AccountContext';
import { AppConnectWidget } from '../app/AppConnectButton';
import { useTwitterContext } from '../app/TwitterContext';
import { ViewportPage } from '../app/Viewport';
import { RouteNames } from '../route.names';
import { AppButton } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading } from '../ui-components/LoadingDiv';

export const AppHome = (props: {}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isConnected } = useAccountContext();
  const { needAuthorize, connect: connectTwitter } = useTwitterContext();

  const content = (() => {
    if (isConnected && needAuthorize)
      return (
        <AppButton
          primary
          onClick={() => connectTwitter()}
          label={t('Connect Twitter/X')}></AppButton>
      );

    if (!isConnected) return <AppConnectWidget></AppConnectWidget>;

    return <Loading />;
  })();

  return (
    <ViewportPage
      content={<BoxCentered>{content}</BoxCentered>}
      nav={<></>}></ViewportPage>
  );
};
