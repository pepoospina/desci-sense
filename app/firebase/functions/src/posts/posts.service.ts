import { AppPostCreate, PLATFORM, TweetRead } from '../@webapp/types';
import { createPost } from '../db/posts.repo';
import { postMessageTwitter } from '../twitter/twitter.utils';

export const postPost = async (userId: string, post: AppPostCreate) => {
  let tweet: TweetRead | undefined = undefined;

  if (post.platforms.includes(PLATFORM.X)) {
    tweet = await postMessageTwitter(userId, post.content);
  }

  const createdPost = await createPost({ ...post, author: userId, tweet });

  return createdPost;
};
