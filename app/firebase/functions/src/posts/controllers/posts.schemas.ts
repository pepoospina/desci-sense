import { array, object, string } from 'yup';

export const postsValidationScheme = object({
  contentHTML: string().required(),
  contentPlain: string().required(),
  platforms: array().of(string()).required(),
}).noUnknown(true);
