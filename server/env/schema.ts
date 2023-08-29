import { z } from 'zod';

export const serverSchema = z.object({
  API_XP_SERVICES_URL: z.string().url(),
});

export const serverEnv = {
  API_XP_SERVICES_URL: process.env.API_XP_SERVICES_URL,
};
