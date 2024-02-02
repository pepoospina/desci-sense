import { Box } from 'grommet';
import { Send } from 'grommet-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TweetV2PostTweetResult } from 'twitter-api-v2';

import { useAccountContext } from '../app/AccountContext';
import { ViewportPage } from '../app/Viewport';
import { PostEditor } from '../post/PostEditor';
import { postMessage } from '../post/post.utils';
import { PLATFORM } from '../types';
import { AppButton, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { Loading } from '../ui-components/LoadingDiv';
import { useThemeContext } from '../ui-components/ThemedApp';

export const AppPost = (props: {}) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const { appAccessToken } = useAccountContext();

  const [postText, setPostText] = useState<string>();
  const [isSending, setIsSending] = useState<boolean>();
  const [postSentError, setPostSentError] = useState<boolean>();
  const [tweet, setTweet] = useState<TweetV2PostTweetResult>();

  const send = () => {
    if (postText && appAccessToken) {
      setIsSending(true);
      postMessage(
        { content: postText, platforms: [PLATFORM.X] },
        appAccessToken
      ).then((tweet) => {
        if (tweet) {
          setPostText(undefined);
          setTweet(tweet);
          setIsSending(false);
        } else {
          setPostSentError(true);
        }
      });
    }
  };

  const content = (() => {
    if (isSending) {
      return <Loading></Loading>;
    }

    if (tweet) {
      return (
        <>
          <AppHeading level="3">{t('postSent')}</AppHeading>
          <TweetAnchor></TweetAnchor>
        </>
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
