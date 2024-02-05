import { object, string } from 'yup';

export const postsValidationScheme = object({
  content: string().required(),
}).noUnknown(true);
