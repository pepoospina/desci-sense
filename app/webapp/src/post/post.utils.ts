import { FUNCTIONS_BASE } from '../app/config';
import { PostCreate } from '../types';

export const postMessage = async (post: PostCreate, appAccessToken: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/posts/post', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${appAccessToken}`,
    },
    body: JSON.stringify(post),
  });

  const body = await res.json();
  return body.twitter_user;
};
