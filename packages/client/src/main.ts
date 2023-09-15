import 'vite/modulepreload-polyfill';
import './main.css';
import { FeedbackSuccess } from 'decorator-shared/views/feedback';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';

import getContent from './get-content';

import {
  HeaderMenuLinkCols,
  HeaderMenuLinks,
} from 'decorator-shared/views/header-menu-links';
import { getHeaderNavbarItems } from 'decorator-shared/views/header/navbar-items';
import { texts } from 'decorator-shared/texts';
import RenderLanguageSelector from 'decorator-shared/views/language-selector';

// Maybe create a file that does this
import './views/language-selector.client';
import './views/components/toggle-icon-button.client';
import './views/search.client';
import './views/loader.client';
import './views/decorator-lens.client';
import { AddSnarveierListener } from './views/header-menu-links.client';

import { SearchShowMore } from 'decorator-shared/views/search-show-more';
import html from 'decorator-shared/html';
import { SearchEvent } from './views/search.client';
import {
  hasClass,
  hydrateParams,
  replaceElement,
  setAriaExpanded,
} from './utils';
import type { Context, Params } from 'decorator-shared/params';
import { attachLensListener } from './views/decorator-lens.client';
import { fetchDriftsMeldinger } from './views/driftsmeldinger.client';
import { handleSearchButtonClick } from './views/search.client';
import { initLoggedInMenu } from './views/logged-in-menu.client';

type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

const breakpoints = {
  lg: 1024, // See custom-media-queries.css
} as const;

const CONTEXTS = ['privatperson', 'arbeidsgiver', 'samarbeidspartner'] as const;

// Basic setup for development with the decorator-params script tag.
declare global {
  interface Window {
    decoratorParams: Params;
  }
}

window.decoratorParams = hydrateParams();
console.log(window.decoratorParams);

const addBreadcrumbEventListeners = () =>
  document
    .getElementById('breadcrumbs-wrapper')
    ?.querySelectorAll('a[data-handle-in-app]')
    .forEach((el) =>
      el.addEventListener('click', (e) => {
        e.preventDefault();

        window.postMessage({
          source: 'decorator',
          event: 'breadcrumbClick',
          payload: {
            url: el.getAttribute('href'),
            title: el.innerHTML,
            handleInApp:
              el.getAttribute('data-handle-in-app') === 'true' ? true : false,
          },
        });
      }),
    );

// Client side environment variables, mocking for now.

// Initialize
AddSnarveierListener();
addBreadcrumbEventListeners();
attachLensListener();
fetchDriftsMeldinger();
handleSearchButtonClick();

// Get the params this version of the decorator was initialized with
document.getElementById('search-input')?.addEventListener('input', (e) => {
  const { value } = e.target as HTMLInputElement;
  if (value.length > 2) {
    fetch(`${import.meta.env.VITE_DECORATOR_BASE_URL}/api/sok?ord=${value}`)
      .then((res) => res.json())
      .then(({ hits, total }) => {
        replaceElement({
          selector: '#search-hits > ul',
          html: hits
            .map(
              (hit: {
                displayName: string;
                highlight: string;
                href: string;
              }) => html`
                <search-hit href="${hit.href}">
                  <h2 slot="title">${hit.displayName}</h2>
                  <p slot="description">${hit.highlight}</p>
                </search-hit>
              `,
            )
            .join(''),
        });

        replaceElement({
          selector: '#show-more',
          html: SearchShowMore({
            word: value,
            total,
          }),
        });
      });
  }
});

// Listen for f5 input

window.addEventListener('message', (e) => {
  if (e.data.source === 'decoratorClient' && e.data.event === 'ready') {
    window.postMessage({ source: 'decorator', event: 'ready' });
  }
  // Maybe have a map of functions where the name of the function is the event name, then you can just loop through and call if it's present on the payload.
  if (e.data.source === 'decoratorClient' && e.data.event == 'params') {
    if (e.data.payload.breadcrumbs) {
      replaceElement({
        selector: '#breadcrumbs-wrapper',
        html: Breadcrumbs({
          breadcrumbs: e.data.payload.breadcrumbs,
        }),
        contentKey: 'outerHTML',
      }).then(addBreadcrumbEventListeners);
    }

    if (e.data.payload.utilsBackground) {
      const utilsContainer = document.querySelector(
        '.decorator-utils-container',
      );
      if (utilsContainer) {
        ['gray', 'white'].forEach((bg) =>
          utilsContainer.classList.remove(`decorator-utils-container_${bg}}`),
        );
        const bg = e.data.payload.utilsBackground;
        if (['gray', 'white'].includes(bg)) {
          utilsContainer.classList.add(`decorator-utils-container_${bg}`);
        }
      }
    }

    if (e.data.payload.availableLanguages) {
      const el = document.querySelector('language-selector');
      if (el) {
        el.availableLanguages = e.data.payload.availableLanguages;
      } else {
        // Her appender vi en language selector om den ikke er i DOMen allerede
        // TODO: dette kan garantert gjøres ryddigere!
        //
        const container = document.querySelector('.decorator-utils-container');

        if (container) {
          const temp = document.createElement('div');
          temp.innerHTML =
            RenderLanguageSelector({
              availableLanguages: e.data.payload.availableLanguages,
            }) ?? '';
          container.append(...temp.childNodes);
        }
      }
    }
    if (e.data.payload.context) {
      setActiveContext(e.data.payload.context);
    }
  }
});

document
  .querySelectorAll('.context-link')
  .forEach((contextLink) =>
    contextLink.addEventListener('click', () =>
      setActiveContext(contextLink.getAttribute('data-context') as Context),
    ),
  );

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
    document
      .querySelectorAll('.context-link')
      .forEach((el) =>
        el.getAttribute('data-context') === context
          ? el.classList.add('lenkeActive')
          : el.classList.remove('lenkeActive'),
      );

    const headerMenuLinks = await getContent('headerMenuLinks', {
      context,
    });

    replaceElement({
      selector: '#header-menu-links',
      html: HeaderMenuLinks({
        headerMenuLinks,
        cols: headerMenuLinks.length as HeaderMenuLinkCols,
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

  menuButton?.addEventListener('click', () => {
    setAriaExpanded(menuButton);
    const menu = document.getElementById('menu');
    menuButton?.classList.toggle('active');
    menu?.classList.toggle('active');
    menuBackground?.classList.toggle('active');

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

if (window.decoratorParams.simple === false) {
  const searchEventHandlers: Record<SearchEvent, () => void> = {
    'started-typing': () => {
      document
        .querySelector('#header-menu-links')
        ?.classList.add('is-searching');
    },
    'is-searching': () => {
      document.querySelector('#search-loader')?.classList.add('active');
    },
    'stopped-searching': () => {
      document
        .querySelector('#header-menu-links')
        ?.classList.remove('is-searching');
    },
    'finished-searching': () => {
      document.querySelector('#search-loader')?.classList.remove('active');
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

  [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
});

// Feedback
const buttons = document.querySelectorAll('.feedback-content button');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const feedbackContent = document.querySelector('.feedback-content');
    if (feedbackContent) {
      feedbackContent.innerHTML = FeedbackSuccess();
    }
  });
});

function attachAmplitudeLinks() {
  document.body.addEventListener('click', (e) => {
    if ((e.target as Element).classList.contains('amplitude-link')) {
      alert('Found an ampltidude link');
    }
    if (
      ((e.target as Element).parentNode as Element)?.classList.contains(
        'amplitude-link',
      )
    ) {
      alert('Found an ampltidude link');
    }
  });
}

attachAmplitudeLinks();

async function populateLoggedInMenu(authObject: Auth) {
  const menuItems = document.getElementById('menu-items');
  // Store a snapshot if user logs out

  if (menuItems) {
    const snapshot = menuItems.outerHTML;

    const myPageMenu = await getContent('myPageMenu', {});

    const newMenuItems = getHeaderNavbarItems(
      {
        innlogget: authObject.authenticated,
        name: authObject.name,
        myPageMenu,
        // For testing
        texts: texts['no'],
      },
      window.decoratorParams.simple,
    );

    menuItems.outerHTML = newMenuItems;

    initLoggedInMenu();

    handleMenuButton();

    document.getElementById('logout-button')?.addEventListener('click', () => {
      document.getElementById('menu-items').outerHTML = snapshot;
      window.location.href = `${import.meta.env.VITE_LOGOUT_URL}`;
    });
  }
}

async function checkAuth() {
  const authUrl = `${import.meta.env.VITE_DECORATOR_API}/auth`;
  const sessionUrl = `${import.meta.env.VITE_AUTH_API}/oauth2/session`;

  try {
    const fetchResponse = await fetch(authUrl, {
      credentials: 'include',
    });
    const response = await fetchResponse.json();

    if (!response.authenticated) {
      return;
    }

    const sessionResponse = await fetch(sessionUrl, {
      credentials: 'include',
    });
    const session = await sessionResponse.json();
    console.log(session);
    populateLoggedInMenu(response);
  } catch (error) {
    throw new Error(`Error fetching auth: ${error}`);
  }
}

checkAuth();

function handleLogin() {
  const loginLevel = window.decoratorParams.level || 'Level4';
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
