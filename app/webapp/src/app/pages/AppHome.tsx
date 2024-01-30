import { AppHeading } from '../../ui-components';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { ViewportPage } from '../Viewport';

export const AppHome = (props: {}) => {
  const content = (() => {
    return (
      <BoxCentered>
        <AppHeading level="1">Welcome</AppHeading>
      </BoxCentered>
    );
  })();

  return <ViewportPage content={content} nav={<></>}></ViewportPage>;
};
