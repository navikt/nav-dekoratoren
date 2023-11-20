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

// At the start of each request
type CorsError = {
    kind: 'cors-error',
    message: string,
    response: Response
}

type Valid = {
    kind: 'valid',
    headers: HeadersInit
}
type Result = CorsError | Valid;


export function handleCors(request: Request): Result {
    const host = request.headers.get('host');
    const result = corsSchema.safeParse(host);

    if (!result.success) {
        return {
            kind: 'cors-error' as const,
            message: result.error.message,
            response: new Response(result.error.message, {
                status: 403,
            })
        } as const
    }


    const shared = {
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    }


    const headers: Record<RunningEnv, HeadersInit> = {
        NAV_NO:
            {
                'Access-Control-Allow-Origin': corsWhitelist.join(', '),
                ...shared
            }
        ,
        localhost: {
            'Access-Control-Allow-Origin': [
                'http://localhost:3006',
            ].join(', '),
            'Access-Control-Allow-Credentials': 'true',
            ...shared
        }
    };

    return {
        kind: 'valid' as const,
        headers: headers[env.ENV]
    }
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
