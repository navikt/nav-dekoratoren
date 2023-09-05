import { z } from 'zod';

export const serverSchema = z.object({
  ENONICXP_SERVICES: z.string().url(),
  VITE_DECORATOR_BASE_URL: z.string().url(),
  VITE_DECORATOR_API: z.string().url(),
  LOGIN_API: z.string().url(),
});

export const serverEnv = {
  ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
  VITE_DECORATOR_BASE_URL: process.env.VITE_DECORATOR_BASE_URL,
  VITE_DECORATOR_API: process.env.VITE_DECORATOR_API,
  LOGIN_API: process.env.LOGIN_API,
};
