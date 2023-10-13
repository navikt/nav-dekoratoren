import 'vite/modulepreload-polyfill';
import './main.css';
import.meta.glob('./styles/*.css', { eager: true });

import getContent from './get-content';

import './views/lenke-med-sporing/lenke-med-sporing';
import { HeaderMenuLinks } from 'decorator-shared/views/header/header-menu-links';
import * as api from './api';

import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';

// Maybe create a file that does this
import './views/language-selector';
import './views/toggle-icon-button';
import './views/search';
import './views/loader';
import './views/decorator-lens';
import './views/local-time';

import { SearchEvent } from './views/search';
import { hasClass, replaceElement, setAriaExpanded } from './utils';

import {
  type Context,
  type Params,
} from 'decorator-shared/params';
import { attachLensListener } from './views/decorator-lens';
import { fetchDriftsMeldinger } from './views/driftsmeldinger';
import { initLoggedInMenu } from './views/logged-in-menu';
import { logoutWarningController } from './controllers/logout-warning';

import {
  addBreadcrumbEventListeners,
  afterAuthListeners,
  onLoadListeners,
} from './listeners';

import { type AnalyticsEventArgs } from './analytics/constants';
import { type AppState } from 'decorator-shared/types';
import { handleSearchButtonClick } from './listeners/search-listener';
// CSS classe
import headerClasses from './styles/header.module.css';
import menuItemsClasses from 'decorator-shared/views/header/navbar-items/menu-items.module.css';
import iconButtonClasses from 'decorator-shared/views/components/icon-button.module.css';
import complexHeaderMenuClasses from './styles/complex-header-menu.module.css';
import { erNavDekoratoren } from './helpers/urls';
import loggedInMenuClasses from 'decorator-shared/views/header/navbar-items/logged-in-menu.module.css';

import { SimpleHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/simple-header-navbar-items';
import { ComplexHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items/complex-header-navbar-items';

// import { AnalyticsCategory } from './analytics/analytics';

type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

const breakpoints = {
  lg: 1024, // See custom-media-queries.css
} as const;

const CONTEXTS = ['privatperson', 'arbeidsgiver', 'samarbeidspartner'] as const;


declare global {
  interface Window {
    __DECORATOR_DATA__: AppState;
    loginDebug: {
      expireToken: (seconds: number) => void;
      expireSession: (seconds: number) => void;
    };
    analyticsEvent: (props: AnalyticsEventArgs) => void;
    logPageView: (params: Params, authState: Auth) => Promise<unknown>;
    logAmplitudeEvent: (
      eventName: string,
      eventData: Record<string, any>,
      origin?: string,
    ) => void;
    startTaskAnalyticsSurvey: (state: AppState) => void;
    // For task analytics, should have better types?
    TA: any;
    dataLayer: any;
  }
}

window.__DECORATOR_DATA__ = JSON.parse(
  document.getElementById('__DECORATOR_DATA__')?.innerHTML ?? '',
);

window.__DECORATOR_DATA__.env = {
  MIN_SIDE_URL: import.meta.env.VITE_MIN_SIDE_URL,
  LOGIN_URL: import.meta.env.VITE_LOGIN_URL,
  LOGOUT_URL: import.meta.env.VITE_LOGOUT_URL,
  MIN_SIDE_ARBEIDSGIVER_URL: import.meta.env.VITE_MIN_SIDE_ARBEIDSGIVER_URL,
  XP_BASE_URL: import.meta.env.VITE_XP_BASE_URL,
  APP_URL: import.meta.env.VITE_APP_URL,
};

const updateDecoratorParams = (params: Partial<Params>): Params => {
  window.__DECORATOR_DATA__.params = {
    ...window.__DECORATOR_DATA__.params,
    ...params,
  };

  return window.__DECORATOR_DATA__.params;
};

onLoadListeners({
  texts: window.__DECORATOR_DATA__.texts,
});

attachLensListener();
fetchDriftsMeldinger();
handleSearchButtonClick();

if (window.__DECORATOR_DATA__.params.logoutWarning) {
  logoutWarningController(
    window.__DECORATOR_DATA__.params.logoutWarning,
    window.__DECORATOR_DATA__.texts,
  );
}

window.addEventListener('message', (e) => {
  if (e.data.source === 'decoratorClient' && e.data.event === 'ready') {
    window.postMessage({ source: 'decorator', event: 'ready' });
  }
  if (e.data.source === 'decoratorClient' && e.data.event == 'params') {
    if (
      e.data.payload.breadcrumbs ||
      e.data.payload.availableLanguages ||
      e.data.payload.utilsBackground
    ) {
      if (e.data.payload.breadcrumbs) {
        updateDecoratorParams({
          breadcrumbs: e.data.payload.breadcrumbs,
        });
      }
      if (e.data.payload.availableLanguages) {
        updateDecoratorParams({
          availableLanguages: e.data.payload.availableLanguages,
        });
      }
      if (e.data.payload.utilsBackground) {
        updateDecoratorParams({
          utilsBackground: e.data.payload.utilsBackground,
        });
      }

      const {
        utilsBackground,
        breadcrumbs = [],
        availableLanguages = [],
      } = window.__DECORATOR_DATA__.params;

      const getUtilsContainer = () => {
        const utilsContainer = document.querySelector(
          '.decorator-utils-container',
        );
        if (utilsContainer) {
          return utilsContainer;
        } else {
          const newUtilsContainer = document.createElement('div');
          document
            .querySelector(`.${headerClasses.siteheader}`)
            ?.after(newUtilsContainer);
          return newUtilsContainer;
        }
      };

      getUtilsContainer().outerHTML =
        DecoratorUtilsContainer({
          utilsBackground,
          breadcrumbs,
          availableLanguages,
        })?.render() ?? '';

      addBreadcrumbEventListeners();
    }

    if (e.data.payload.context) {
      setActiveContext(e.data.payload.context);
    }
  }
});

document
  .querySelectorAll(`.${headerClasses.headerContextLink}`)
  .forEach((contextLink) => {
    contextLink.addEventListener('click', (e) => {
      if (erNavDekoratoren()) {
        e.preventDefault();
      }

      setActiveContext(contextLink.getAttribute('data-context') as Context);
    });
  });

// For inside menu.
document.body.addEventListener('click', (e) => {
  const target = hasClass({
    element: e.target as HTMLElement,
    className: 'context-menu-link-wrapper',
  });

  if (target) {
    e.preventDefault();
    // alert('Found a context menu link wrapper')
    const newContext = target.getAttribute('data-context') as Context;
    setActiveContext(newContext);
  }
});

async function setActiveContext(context: Context | null) {
  if (context && CONTEXTS.includes(context)) {
    updateDecoratorParams({ context });

    document
      .querySelectorAll(`.${headerClasses.headerContextLink}`)
      .forEach((el) =>
        el.getAttribute('data-context') === context
          ? el.classList.add(headerClasses.lenkeActive)
          : el.classList.remove(headerClasses.lenkeActive),
      );

    const headerMenuLinks = await getContent('headerMenuLinks', {
      context,
    });

    replaceElement({
      selector: '#header-menu-links',
      html: HeaderMenuLinks({
        headerMenuLinks,
        className: `cols-${headerMenuLinks.length}`,
      }),
    });
  } else {
    console.warn('Unrecognized context', context);
  }
}

const menuBackground = document.getElementById('menu-background');

function purgeActive(el: HTMLElement) {
  el.classList.remove('active');
}

let isMenuOpen = false;

function handleMenuButton() {
  // Can probably be done direclty
  const menuButton = document.getElementById('menu-button');
  const profileButton = document.getElementById('profile-button');

  menuButton?.addEventListener('click', () => {
    setAriaExpanded(menuButton);
    const menu = document.getElementById('menu');
    menuButton?.classList.toggle(iconButtonClasses.active);
    menu?.classList.toggle(headerClasses.active);
    menuBackground?.classList.toggle(headerClasses.active);

    if (profileButton) {
      profileButton.classList.remove(iconButtonClasses.active);
    }

    const isMobile = window.innerWidth < breakpoints.lg;
    isMenuOpen = !isMenuOpen;

    if (!isMobile) return;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
}

// Keeping this for later when fixing opening menus and such
// function dismissMenu() {
//     const menu = document.getElementById('menu');
//     const menuButton = document.getElementById('menu-button');
//
//     [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
// }

// Handles mobile search
const [inlineSearch] = document.getElementsByTagName('inline-search');

if (window.__DECORATOR_DATA__.params.simple === false) {
  const searchEventHandlers: Record<SearchEvent, () => void> = {
    'started-typing': () => {
      document
        .querySelector('#header-menu-links')
        ?.classList.add('is-searching');
    },
    'is-searching': () => {
      document
        .querySelector(`.${complexHeaderMenuClasses.searchLoader}`)
        ?.classList.add(complexHeaderMenuClasses.active);
    },
    'stopped-searching': () => {
      document
        .querySelector('#header-menu-links')
        ?.classList.remove('is-searching');
    },
    'finished-searching': () => {
      document
        .querySelector(`.${complexHeaderMenuClasses.searchLoader}`)
        ?.classList.remove(complexHeaderMenuClasses.active);
    },
  };

  for (const [event, handler] of Object.entries(searchEventHandlers)) {
    inlineSearch.addEventListener(event, handler);
  }
}

// when they click the background
menuBackground?.addEventListener('click', () => {
  const menu = document.getElementById('menu');
  const menuButton = document.getElementById('menu-button');
  const profileButton = document.getElementById('profile-button');

  const dropdowns = document.querySelectorAll('.dropdown');
  const loggedInMenuWrapper = document.getElementById('loggedin-menu-wrapper');

  profileButton?.classList.remove(iconButtonClasses.active);
  [menuButton, menuBackground, menu, loggedInMenuWrapper, ...dropdowns].forEach(
    (el) => el && purgeActive(el as HTMLElement),
  );
});

async function populateLoggedInMenu(authObject: Auth) {
  const menuItems = document.querySelector(`.${menuItemsClasses.menuItems}`);
  // Store a snapshot if user logs out

  if (menuItems) {
    const snapshot = menuItems.outerHTML;

    const template = window.__DECORATOR_DATA__.params.simple
      ? SimpleHeaderNavbarItems({
          innlogget: authObject.authenticated,
          name: authObject.name,
          texts: window.__DECORATOR_DATA__.texts,
        })
      : ComplexHeaderNavbarItems({
          innlogget: authObject.authenticated,
          name: authObject.name,
          myPageMenu: await getContent('myPageMenu', {}),
          texts: window.__DECORATOR_DATA__.texts,
        });

    menuItems.outerHTML = template.render();

    initLoggedInMenu();
    handleMenuButton();

    document.getElementById('logout-button')?.addEventListener('click', () => {
      const menuitems = document.getElementById('menu-items');
      if (menuitems) {
        menuitems.outerHTML = snapshot;
      }

      window.location.href = `${import.meta.env.VITE_LOGOUT_URL}`;
    });
  }
}

api.checkAuth({
  onSuccess: async (response) => {
    window.logPageView(window.__DECORATOR_DATA__.params, response);
    window.startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);

    await populateLoggedInMenu(response);

    const notificationsResponse = await fetch(
      `${import.meta.env.VITE_DECORATOR_BASE_URL}/api/notifications`,
      {
        credentials: 'include',
      },
    );
    if (notificationsResponse.status === 200) {
      const notificationsUnread = document.querySelector(
        `.${loggedInMenuClasses.notificationsUnread}`,
      );
      notificationsUnread?.classList.add(loggedInMenuClasses.active);
    }

    const notificationsMenuContent = document.querySelector(
      '#notifications-menu-content',
    );

    if (notificationsMenuContent) {
      notificationsMenuContent.innerHTML =
        notificationsResponse.status === 200
          ? await notificationsResponse.text()
          : window.__DECORATOR_DATA__.texts.notifications_error;
    }

    // Attach arkiver listener
    afterAuthListeners();
  },
});

function handleLogin() {
  const loginLevel = window.__DECORATOR_DATA__.params.level || 'Level4';
  document
    .getElementById('login-button')
    ?.addEventListener('click', async () => {
      window.location.href = `${import.meta.env.VITE_LOGIN_URL}?redirect=${
        window.location.href
      }&level=${loginLevel}`;
    });
}

handleMenuButton();
handleLogin();
