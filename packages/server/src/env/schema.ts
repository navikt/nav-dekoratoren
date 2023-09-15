import { z } from 'zod';

export const serverSchema = z.object({
  ENONICXP_SERVICES: z.string().url(),
  VITE_DECORATOR_BASE_URL: z.string().url(),
  VITE_DECORATOR_API: z.string().url(),
  VITE_AUTH_API: z.string().url(),
  PORT: z.number(),
  NODE_ENV: z.string(),
});

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
  VITE_DECORATOR_BASE_URL: process.env.VITE_DECORATOR_BASE_URL,
  VITE_DECORATOR_API: process.env.VITE_DECORATOR_API,
  VITE_AUTH_API: process.env.VITE_AUTH_API,
  PORT: portToNumber(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
};
