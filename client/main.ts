import 'vite/modulepreload-polyfill';
import './main.css';
import { FeedbackSuccess } from '../views/feedback';
import {
  Breadcrumbs,
  addEventListeners as addBreadcrumbEventListeners,
} from '../views/breadcrumbs';
import SearchHit from '../views/search-hit';
import getContent from './get-content';
import { HeaderMenuLinks } from '@/views/header-menu-links';
import { MenuItems } from '@/views/menu-items';
import { texts } from '@/texts';
import RenderLanguageSelector from '@/views/language-selector';
import '@/views/language-selector.client';
import { SearchShowMore } from '@/views/search-show-more';

/**
 * Conditionally set the innerHTML of an element. To avoid conditionals everywhere.
 * you also avoid having to make a var for the element just to do checking and setting content.
 */

function replaceElement({
  selector,
  html,
  contentKey = 'innerHTML',
}: {
  selector: string;
  html: string;
  contentKey?: 'innerHTML' | 'outerHTML';
}) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);

    if (el) {
      el[contentKey] = html;
      resolve(el);
    }

    resolve(undefined);
  });
}

document.getElementById('search-input')?.addEventListener('input', (e) => {
  const { value } = e.target as HTMLInputElement;
  if (value.length > 2) {
    fetch(`/dekoratoren/api/sok?ord=${value}`)
      .then((res) => res.json())
      .then(({ hits, total }) => {
        replaceElement({
          selector: '#search-hits > ul',
          html: hits
            .map(
              (hit: { displayName: string; highlight: string; href: string }) =>
                SearchHit({ ...hit }),
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

addBreadcrumbEventListeners();

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
      setActiveContext(contextLink.getAttribute('data-context')),
    ),
  );

async function setActiveContext(context: string | null) {
  if (
    context &&
    ['privatperson', 'arbeidsgiver', 'samarbeidspartner'].includes(context)
  ) {
    document
      .querySelectorAll('.context-link')
      .forEach((el) =>
        el.getAttribute('data-context') === context
          ? el.classList.add('lenkeActive')
          : el.classList.remove('lenkeActive'),
      );

    replaceElement({
      selector: '#header-menu-links',
      html: HeaderMenuLinks({
        headerMenuLinks: await getContent('headerMenuLinks', {
          context: context as
            | 'privatperson'
            | 'arbeidsgiver'
            | 'samarbeidspartner',
        }),
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

function handleMenuButton() {
  // Can probably be done direclty
  const menuButton = document.getElementById('menu-button');

  menuButton?.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menuButton?.classList.toggle('active');
    menu?.classList.toggle('active');
    menuBackground?.classList.toggle('active');
  });
}

// when they click the background
menuBackground?.addEventListener('click', () => {
  const menu = document.getElementById('menu');
  const menuButton = document.getElementById('menu-button');

  [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
});

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

function handleLogin() {
  document
    .getElementById('login-button')
    ?.addEventListener('click', async () => {
      const response = (await (await fetch('/api/auth')).json()) as {
        authenticated: boolean;
        name: string;
        level: string;
      };

      const menuItems = document.getElementById('menu-items');
      // Store a snapshot if user logs out

      if (menuItems) {
        const snapshot = menuItems.outerHTML;

        const myPageMenu = await getContent('myPageMenu', {});

        const newMenuItems = MenuItems({
          innlogget: response.authenticated,
          name: response.name,
          myPageMenu: myPageMenu,
          // For testing
          texts: texts['no'],
        });

        menuItems.outerHTML = newMenuItems;

        handleMenuButton();

        document
          .getElementById('logout-button')
          ?.addEventListener('click', () => {
            document.getElementById('menu-items').outerHTML = snapshot;
            handleLogin();
            handleMenuButton();
          });
      }
    });
}

handleMenuButton();
handleLogin();
