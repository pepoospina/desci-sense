import { object, array, string } from "yup";

export const postsValidationScheme = object({
  content: string().required(),
  platforms: array().of(string()).required(),
}).noUnknown(true);
