import { AppConnectWidget } from '../app/AppConnectButton';
import { ViewportPage } from '../app/Viewport';
import { BoxCentered } from '../ui-components/BoxCentered';

export const AppHome = (props: {}) => {
  const content = (() => {
    return (
      <BoxCentered>
        <AppConnectWidget></AppConnectWidget>
      </BoxCentered>
    );
  })();

  return <ViewportPage content={content} nav={<></>}></ViewportPage>;
};
