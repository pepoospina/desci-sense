import { FUNCTIONS_BASE } from '../app/config';
import { AppPostCreate, PLATFORM } from '../types';
import { htmlToPlain } from '../utils/general';

export const postMessage = async (
  contentHTML: string,
  platforms: [PLATFORM],
  appAccessToken: string
) => {
  const contentPlain = htmlToPlain(contentHTML);
  const post: AppPostCreate = {
    contentHTML,
    contentPlain,
    platforms,
  };
  const res = await fetch(FUNCTIONS_BASE + '/posts/post', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify(post),
  });

  const body = await res.json();
  return body.post;
};
