import z from 'zod';
import { env } from './env/server';
import { RunningEnv } from './env/schema';

const corsWhitelist = [
    '.nav.no',
    '.oera.no',
    '.nais.io',
    '.intern.dev.nav.no',
    'https://preview-sykdomifamilien.gtsb.io',
    'navdialog.cs102.force.com',
    'navdialog.cs106.force.com',
    'navdialog.cs108.force.com',
    'navdialog.cs162.force.com',
    'decorator-next.ekstern.dev.nav.no',
    '.personbruker'
];


export const isAllowedDomain = (origin?: string) =>
    origin && corsWhitelist.some((domain) => origin.endsWith(domain));

export const corsSchema = z.string().refine(
    (origin) => {
        return origin.includes('localhost') || isAllowedDomain(origin);
    },
    (origin) => {
        if (!origin) {
            return {
                message: 'Origin header is missing',
            };
        }

        return {
            message: `Origin ${origin} is not allowed. Valid origins are ${corsWhitelist.join(
                ', '
            )}`,
        };
    }
);



export function handleCors(request: Request): HeadersInit {
    const origin = request.headers.get('Origin');
    const result = corsSchema.safeParse(origin);

    const headers = new Headers();

    if (result.success) {
        headers.set('Access-Control-Allow-Origin', origin as string);
        headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        headers.set('Access-Control-Allow-Credentials', 'true');
        headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') as string);
    }

    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '-1');

    return headers.entries();
}
// Reference
// app.use((req, res, next) => {
//     const origin = req.get('origin');
//     const isLocalhost = origin?.startsWith('http://localhost:');
//
//     // Allowed origins // cors
//     if (isAllowedDomain(origin) || isLocalhost) {
//         res.header('Access-Control-Allow-Origin', req.get('origin'));
//         res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//         res.header('Access-Control-Allow-Credentials', 'true');
//
//         const requestHeaders = req.header('Access-Control-Request-Headers');
//         if (requestHeaders) {
//             res.header('Access-Control-Allow-Headers', requestHeaders);
//         }
//     }
//
//     // Cache control
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Pragma', 'no-cache');
//     res.header('Expires', '-1');
//     next();
// });
//
