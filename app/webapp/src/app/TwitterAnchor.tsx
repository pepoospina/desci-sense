import { Anchor } from 'grommet';

import { LoadingDiv } from '../ui-components/LoadingDiv';

export const TwitterAnchor = (props: { screen_name?: string }) => {
  if (!props.screen_name) {
    return <LoadingDiv></LoadingDiv>;
  }
  return (
    <Anchor
      style={{}}
      target="_blank"
      href={`https://twitter.com/${props.screen_name}`}
      size="small">
      {props.screen_name}
    </Anchor>
  );
};
