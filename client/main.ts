import 'vite/modulepreload-polyfill';
import './main.css';
import { AvailableLanguage, Breadcrumb, UtilsBackground } from '../params';
import { FeedbackSuccess } from '../views/feedback';
import { Breadcrumbs } from '../views/breadcrumbs';
import SearchHit from '../views/search-hit';
import getContent from './get-content';
import { HeaderMenuLinks } from '@/views/header-menu-links';
import LanguageSelector from '@/views/language-selector';

document.getElementById('search-input')?.addEventListener('input', (e) => {
  const { value } = e.target as HTMLInputElement;
  if (value.length > 2) {
    console.log(value);
    fetch(`/dekoratoren/api/sok?ord=${value}`)
      .then((res) => res.json())
      .then((json) => json.hits)
      .then((hits) => {
        const searchHitsEl = document.getElementById('search-hits');
        if (searchHitsEl) {
          searchHitsEl.innerHTML = hits
            .map(
              (hit: {
                displayName: string;
                hightlight: string;
                href: string;
              }) => SearchHit({ ...hit }),
            )
            .join('');
        }
      });
  }
});

window.addEventListener('message', (e) => {
  if (e.data.source === 'decoratorClient' && e.data.event === 'ready') {
    window.postMessage({ source: 'decorator', event: 'ready' });
  }
  if (e.data.source === 'decoratorClient' && e.data.event == 'params') {
    if (e.data.payload.breadcrumbs) {
      const breadcrumbs: Breadcrumb[] = e.data.payload.breadcrumbs;
      const breadcrumbsWrapperEl = document.getElementById(
        'breadcrumbs-wrapper',
      );
      if (breadcrumbsWrapperEl) {
        breadcrumbsWrapperEl.outerHTML = Breadcrumbs({
          breadcrumbs,
          utilsBackground: breadcrumbsWrapperEl.getAttribute(
            'data-background',
          ) as UtilsBackground,
        });

        breadcrumbs
          .filter((br) => br.handleInApp)
          .forEach((br) => {
            document
              .getElementById('breadcrumbs-wrapper')
              ?.querySelector(`a[href="${br.url}"]`) // TODO: denne selectoren er ikke god
              ?.addEventListener('click', (e) => {
                e.preventDefault();
                window.postMessage({
                  source: 'decorator',
                  event: 'breadcrumbClick',
                  payload: { yes: 'wat' },
                });
              });
          });
      }
    }
    if (e.data.payload.availableLanguages) {
      const availableLanguages: AvailableLanguage[] =
        e.data.payload.availableLanguages;
      const el = document.getElementById('language-selector');
      if (el) {
        el.outerHTML = LanguageSelector({
          availableLanguages,
        });

        availableLanguages
          .filter((br) => br.handleInApp)
          .forEach((br) => {
            document
              .getElementById('language-selector')
              ?.querySelector(`[data-locale="${br.locale}"]`)
              ?.addEventListener('click', (e) => {
                e.preventDefault();
                window.postMessage({
                  source: 'decorator',
                  event: 'languageSelect',
                  payload: { yes: 'wat' },
                });
              });
          });
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
          ? el.classList.add('active')
          : el.classList.remove('active'),
      );

    const headerMenuLinksEl = document.getElementById('header-menu-links');
    if (headerMenuLinksEl) {
      headerMenuLinksEl.innerHTML = HeaderMenuLinks({
        headerMenuLinks: await getContent('headerMenuLinks', {
          context: context as
            | 'privatperson'
            | 'arbeidsgiver'
            | 'samarbeidspartner',
        }),
      });
    }
  } else {
    console.warn('Unrecognized context', context);
  }
}

window.addEventListener('message', (e) => {
  if (e.data.source === 'decoratorClient') {
    console.log('message:', e.data);
  }
});

const menuButton = document.getElementById('menu-button');
const menuBackground = document.getElementById('menu-background');

function purgeActive(el: HTMLElement) {
  el.classList.remove('active');
}

// Can probably be done direclty
menuButton?.addEventListener('click', () => {
  const menu = document.getElementById('menu');
  menu?.classList.toggle('active');
  menuBackground?.classList.toggle('active');
});

menuBackground?.addEventListener('click', () => {
  const menu = document.getElementById('menu');

  [menuButton, menuBackground, menu].forEach((el) => el && purgeActive(el));
});

// @TODO:  Create a wrapper function around fetch that handles passing search params

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
