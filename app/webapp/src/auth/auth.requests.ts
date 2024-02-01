import { FUNCTIONS_BASE } from '../app/config';

export const postOrcidCode = async (code: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/code', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const body = await res.json();
  return body.token;
};

export const getTwitterAuthToken = async (token: string) => {
  const res = await fetch(FUNCTIONS_BASE + '/auth/twitter-code', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: '',
  });

  const body = await res.json();
  return body.token;
};