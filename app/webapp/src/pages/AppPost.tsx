import { Box, Text } from 'grommet';
import { Send } from 'grommet-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountContext } from '../app/AccountContext';
import { TweetAnchor } from '../app/TwitterAnchor';
import { ViewportPage } from '../app/Viewport';
import { PostEditor } from '../post/PostEditor';
import { postMessage } from '../post/post.utils';
import { AppPost, PLATFORM } from '../types';
import { AppButton, AppCard, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading } from '../ui-components/LoadingDiv';
import { useThemeContext } from '../ui-components/ThemedApp';

export const AppPostPage = (props: {}) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const { appAccessToken, isConnecting, isConnected } = useAccountContext();

  const [postText, setPostText] = useState<string>();
  const [isSending, setIsSending] = useState<boolean>();
  const [postSentError, setPostSentError] = useState<boolean>();
  const [post, setPost] = useState<AppPost>();

  const send = () => {
    if (postText && appAccessToken) {
      setIsSending(true);
      postMessage(
        { content: postText, platforms: [PLATFORM.X] },
        appAccessToken
      ).then((post) => {
        if (post) {
          setPostText(undefined);
          setPost(post);
          setIsSending(false);
        } else {
          setPostSentError(true);
        }
      });
    }
  };

  const newPost = () => {
    setPost(undefined);
  };

  console.log({ isConnected });

  const content = (() => {
    if (isSending || isConnecting) {
      return <Loading></Loading>;
    }

    if (!isConnected) {
      return (
        <AppCard>
          <Text>{t('userNotConnected')}</Text>
        </AppCard>
      );
    }

    if (post) {
      return (
        <Box gap="medium" align="center">
          <AppHeading level="3">{t('postSent')}</AppHeading>
          <TweetAnchor id={post.tweet?.id}></TweetAnchor>
          <AppButton label={t('postNew')} onClick={() => newPost()}></AppButton>
        </Box>
      );
    }

    return (
      <Box width="100%" pad="medium">
        <PostEditor
          editable
          placeholder={t('writeYourPost')}
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
