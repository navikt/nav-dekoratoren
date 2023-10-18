import { expect, test } from 'bun:test';
import { cspHandler } from './csp';

test('CSP headers match snapshot', async () => {
    // Dummy request
    const cspHeaders = cspHandler.handlers[0].handler({
        request: new Request('https://localhost:3000/api/csp'),
        url: new URL('https://localhost:3000/api/csp'),
        query: {},
        ctx: {}
    });

    expect(cspHeaders).toMatchSnapshot();
});
