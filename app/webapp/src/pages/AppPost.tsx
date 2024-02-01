import { Box } from 'grommet';
import { Send } from 'grommet-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountContext } from '../app/AccountContext';
import { ViewportPage } from '../app/Viewport';
import { PostEditor } from '../post/PostEditor';
import { postMessage } from '../post/post.utils';
import { PLATFORM } from '../types';
import { AppButton } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useThemeContext } from '../ui-components/ThemedApp';

export const AppPost = (props: {}) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const { appAccessToken } = useAccountContext();

  const [postText, setPostText] = useState<string>();

  const send = () => {
    if (postText && appAccessToken) {
      postMessage(
        { content: postText, platforms: [PLATFORM.X] },
        appAccessToken
      );
    }
  };

  const content = (() => {
    return (
      <Box width="100%" pad="medium">
        <PostEditor
          editable
          onChanged={(text) => {
            setPostText(text);
          }}></PostEditor>

        <AppButton
          margin={{ vertical: 'small' }}
          reverse
          icon={<Send color={constants.colors.primary}></Send>}
          label={t('send')}
          onClick={() => send()}></AppButton>
      </Box>
    );
  })();

  return (
    <ViewportPage
      content={<BoxCentered>{content}</BoxCentered>}
      nav={<></>}></ViewportPage>
  );
};
