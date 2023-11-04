import { z } from 'zod';

export const serverSchema = z.object({
  ENONICXP_SERVICES: z.string().url(),
  XP_BASE_URL: z.string().url(),
  PORT: z.number(),
  CDN_URL: z.string().url(),
  NODE_ENV: z.enum([
      'production',
      'development',
  ]),
  ENV: z.enum([
      'localhost',
      'NAV_NO'
  ]),
  // Maybe a better way to do this?
  IS_LOCAL_PROD: z.boolean().optional(),
});

export type RunningEnv = z.infer<typeof serverSchema>['ENV'];

export type NodeEnv = z.infer<typeof serverSchema>['NODE_ENV'];

function portToNumber(port: string | undefined) {
  if (!port) {
    throw new Error('Missing port');
  }

  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    throw new Error(`Invalid port: ${port}`);
  }
  return parsedPort;
}

export const serverEnv = {
  ENONICXP_SERVICES: process.env.ENONICXP_SERVICES,
  XP_BASE_URL: process.env.XP_BASE_URL,
  PORT: portToNumber(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV,
  CDN_URL: process.env.CDN_URL,
  IS_LOCAL_PROD: process.env.IS_LOCAL_PROD === 'true',
};
