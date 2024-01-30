import { object, string } from "yup";

export const authCodeScheme = object({
  code: string().required()
}).noUnknown(true);
