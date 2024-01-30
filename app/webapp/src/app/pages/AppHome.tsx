import { BoxCentered } from '../../ui-components/BoxCentered';
import { AppConnectWidget } from '../AppConnectButton';
import { ViewportPage } from '../Viewport';

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
