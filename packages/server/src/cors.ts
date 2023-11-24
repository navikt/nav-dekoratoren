import z from 'zod';

const corsWhitelist = [
    '.nav.no',
    '.oera.no',
    '.nais.io',
    'https://preview-sykdomifamilien.gtsb.io',
    'navdialog.cs102.force.com',
    'navdialog.cs106.force.com',
    'navdialog.cs108.force.com',
    'navdialog.cs162.force.com',
    '.personbruker'
];


export const isAllowedDomain = (origin?: string) =>
    origin && corsWhitelist.some((domain) => origin.endsWith(domain));

export const isLocalhost = (origin?: string) => origin?.includes('localhost:');


export function handleCors(request: Request) {
    const origin = request.headers.get('host');
    console.log(origin);

    const headers = new Headers();

    if (origin && (isAllowedDomain(origin as string) || isLocalhost(origin as string))) {
        console.log('hello')
        headers.set('Access-Control-Allow-Origin', origin as string);
        headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        headers.set('Access-Control-Allow-Credentials', 'true');
        headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') as string);
    }

    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '-1');

    return headers;
}
