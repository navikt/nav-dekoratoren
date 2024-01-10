import { formatParams } from 'decorator-shared/json';
import { LoginLevel, type Context } from 'decorator-shared/params';
import Cookies from 'js-cookie';
import 'vite/modulepreload-polyfill';
import * as api from './api';
import { logoutWarningController } from './controllers/logout-warning';
import './main.css';
import { useLoadIfActiveSession } from './screensharing';
import './views/breadcrumb';
import './views/context-link';
import './views/decorator-utils';
import './views/dropdown-menu';
import './views/language-selector';
import './views/lenke-med-sporing';
import './views/loader';
import './views/local-time';
import './views/main-menu';
import './views/menu-background';
import './views/notifications';
import './views/ops-messages';
import './views/screensharing-modal';
import './views/search-input';
import './views/search-menu';
import './views/feedback';
import './views/login-button';
import { Auth } from './api';
import { addFaroMetaData } from './faro';
import { analyticsLoaded, analyticsReady, createEvent } from './events';
    import { type ParamKey } from 'decorator-shared/params';
import { param, hasParam, updateDecoratorParams, env } from './params';

import.meta.glob('./styles/*.css', { eager: true });

// Just for testing
export const CONTEXTS = ['privatperson', 'arbeidsgiver', 'samarbeidspartner'] as const;


const texts = window.__DECORATOR_DATA__.texts;


updateDecoratorParams({});

if (hasParam('logoutWarning')) {
    logoutWarningController(param('logoutWarning'), texts);
}


window.addEventListener('message', (e) => {
    if (e.data.source === 'decoratorClient' && e.data.event === 'ready') {
        window.postMessage({ source: 'decorator', event: 'ready' });
    }
    if (e.data.source === 'decoratorClient' && e.data.event == 'params') {
        const payload = e.data.payload;

        (['breadcrumbs', 'availableLanguages', 'utilsBackground'] satisfies ParamKey[]).forEach((key) => {
            if (payload[key]) {
                updateDecoratorParams({
                    [key]: payload[key],
                });
            }
        });

        const language = e.data.payload.language;
        if (language && language !== param('language')) {
            updateDecoratorParams({ language });
            Promise.all(
                ['header', 'footer'].map((key) =>
                    fetch(`${env('APP_URL')}/${key}?${formatParams(window.__DECORATOR_DATA__.params)}`).then((res) =>
                        res.text()
                    )
                )
            ).then(([header, footer]) => {
                const headerEl = document.getElementById('decorator-header');
                const footerEl = document.getElementById('decorator-footer');
                if (headerEl && footerEl) {
                    headerEl.outerHTML = header;
                    footerEl.outerHTML = footer;
                    init();
                }
            });
        }

        if (e.data.payload.context) {
            const context = e.data.payload.context;
            if (CONTEXTS.includes(context)) {
                window.dispatchEvent(
                    createEvent('activecontext', {
                        bubbles: true,
                        detail: { context },
                    })
                );
            } else {
                console.warn('Unrecognized context', context);
            }
        }
    }
});

window.addEventListener('activecontext', (event) => {
    updateDecoratorParams({
        context: (event as CustomEvent<{ context: Context }>).detail.context,
    });
});

async function populateLoggedInMenu(authObject: Auth) {
    fetch(
        `${env('APP_URL')}/user-menu?${formatParams({
            ...window.__DECORATOR_DATA__.params,
            name: authObject.name,
            level: `Level${authObject.securityLevel}` as LoginLevel,
        })}`,
        {
            credentials: 'include',
        }
    )
        .then((res) => res.text())
        .then((html) => {
            const userMenu = document.querySelector('user-menu');
            if (userMenu) {
                userMenu.outerHTML = html;
            }
        });
}

//
// await populateLoggedInMenu(response);

const init = async () => {
    const response = await api.checkAuth();

    dispatchEvent(
        new CustomEvent(analyticsLoaded.type, {
            bubbles: true,
            detail: { response },
        })
    );

    if (!response.authenticated) {
        return;
    }

    await populateLoggedInMenu(response);
};

init();

window.addEventListener(analyticsReady.type, () => {
    window.addEventListener(analyticsLoaded.type, (e) => {
        const response = (e as CustomEvent<Auth>).detail;
        window.logPageView(window.__DECORATOR_DATA__.params, response);
        window.startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);
    });
});

// @TODO: Refactor loaders
window.addEventListener('load', () => {
    useLoadIfActiveSession({
        userState: Cookies.get('psCurrentState'),
    });
    addFaroMetaData();
});
