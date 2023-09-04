import { z } from 'zod';

export const serverSchema = z.object({
  ENONICXP_SERVICES: z.string().url(),
  VITE_DECORATOR_BASE_URL: z.string().url(),
});

export const serverEnv = {
  ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
  VITE_DECORATOR_BASE_URL: process.env.VITE_DECORATOR_BASE_URL,
};
