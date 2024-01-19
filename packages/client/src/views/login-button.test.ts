import './login-button';
import { fixture, html } from '@open-wc/testing';

it('makes the right login URL', async () => {
    window.__DECORATOR_DATA__ = {
        env: {
            LOGIN_URL: 'https://login.ekstern.dev.nav.no',
        },
        params: {
            level: 'Level4',
        },
    } as any;

    window.location = {
        href: 'https://www.nav.no',
    } as any;

    const el = await fixture(html`<login-button></login-button>`);

    (el as LoginButton).handleClick();

    expect(window.location.href).to.equal('https://login.ekstern.dev.nav.no?redirect=https://www.nav.no&level=Level4');
});
