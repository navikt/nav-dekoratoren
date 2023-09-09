import { z } from 'zod';

export const serverSchema = z.object({
  ENV: z.string(),
  PORT: z.string(),
  ENONICXP_SERVICES: z.string().url(),
  VITE_DECORATOR_BASE_URL: z.string().url(),
  VITE_DECORATOR_API: z.string().url(),
  VITE_AUTH_API: z.string().url(),
});

export const serverEnv = {
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
  VITE_DECORATOR_BASE_URL: process.env.VITE_DECORATOR_BASE_URL,
  VITE_DECORATOR_API: process.env.VITE_DECORATOR_API,
  VITE_AUTH_API: process.env.VITE_AUTH_API,
};
