import { html } from '../utils';
import { Texts } from '../texts';
import { IconButton } from './components/icon-button';
import { SearchIcon } from './icons/search';
import { CloseIcon } from './icons/close';
import { setAriaExpanded } from '@/client/utils';

export function handleSearchButtonClick() {
  const searchButton = document.getElementById('search-button');

  searchButton?.addEventListener('click', () => {
    setAriaExpanded(searchButton);
    searchButton?.classList.toggle('active');
    document.getElementById('sok-dropdown')?.classList.toggle('active');
    document.getElementById('menu-background')?.classList.toggle('active');
  });
}

export default function Search({ texts }: { texts: Texts }) {
  return html`
    <button id="search-button" class="icon-button">
      ${SearchIcon({
        className: 'searchIcon menuSearch',
      })}
      <span class="icon-button-span"> ${texts.search} </span>
    </button>
    <div id="sok-dropdown">
      <div id="sok-dropdown-content">
        <label for="search-input" class="big-label">Søk på nav.no</label>
        <div class="flex">
          <input id="search-input" type="text" />
          ${IconButton({
            Icon: SearchIcon,
            text: 'Søk',
            className: 'blue-bg-icon',
          })}
        </div>
      </div>
      <div id="search-hits">
        <ul></ul>
        <div id="show-more"></div>
      </div>
    </div>
  `;
}

export function InlineSearchTemplate() {
  return html` <template id="inline-search-template">
    <style>
      .inline-search {
        width: 100%;
        position: relative;
      }

      .inline-search input {
        background-color: white;
        border: 2px solid var(--a-blue-500);
        padding: 0.7rem 1rem;
        border-radius: 3px;
        box-sizing: border-box;
        width: 100%;
        min-height: 48px;
        font-size: 18px;
        line-height: 24px;
      }

      .inline-search-input-container {
        width: 100%;
        position: relative;
      }

      .inline-search ul {
        padding-left: 0px;
      }

      button {
        background: blue;
      }

      label {
        font-size: 18px;
        line-height: 24px;
        font-weight: 600;
        margin-bottom: var(--a-spacing-2);
        display: inline-block;
      }

      .close-icon-button,
      .search-icon-button {
        position: absolute;
        color: var(--a-blue-500);
        height: 100%;
        border: 3px solid transparent;
        background: none;
        box-sizing: border-box;
        border-radius: 6px;
        width: 50px;
      }

      .close-icon-button:hover,
      .search-icon-button:hover {
        color: var(--a-blue-500);
        border: 3px solid var(--a-blue-500);
        background-color: var(--a-blue-100);
      }

      /* .close-icon, .search-icon { */
      /*     position: absolute; */
      /*     color: var(--a-blue-500); */
      /* } */

      .search-icon-button {
        top: 0px;
        right: 0px;
        width: 66px;
      }

      .close-icon-button {
        top: 0px;
        right: 74px;
        display: none;
      }

      .search-icon {
        top: 12px;
        right: 24px;
      }

      .close-icon {
        top: 8px;
        right: 64px;
        width: 32px;
        height: 32px;
      }

      #inline-search-hits {
      }

      #inline-search-hits.is-searching {
        display: none;
      }
    </style>
    <div class="inline-search">
      <label for="inline-search-input" class="big-label">Søk på nav.no</label>
      <div class="inline-search-input-container">
        <input id="inline-search-input" class="decorator-input" type="text" />
        <button class="search-icon-button">
          ${SearchIcon({
            className: 'search-icon',
          })}
        </button>
        <button class="close-icon-button">
          ${CloseIcon({
            className: 'close-icon',
          })}
        </button>
      </div>
      <div id="inline-search-hits">
        <ul></ul>
      </div>
    </div>
  </template>`;
}

export function SearchHitTemplate() {
  return html`<template id="search-hit-template">
    <style>
      p,
      h2 {
        margin: 0;
        padding: 0;
        margin-block-start: 0;
      }

      .search-hit ::slotted(p),
      .search-hit ::slotted(h2) {
        margin: 0;
      }

      .search-hit {
        list-style-type: none;
        padding-top: 1rem /* 16px */;
        padding-bottom: 1rem /* 16px */;
        padding-left: 0.5rem /* 8px */;
        padding-right: 1rem /* 16px */;
        border-bottom: 1px solid rgba(207, 207, 207, 1);
      }

      .search-hit-top {
        display: flex;
        justify-content: start;
        gap: 6px;
      }

      .search-hit svg {
        display: none;
      }

      @media (max-width: 1024px) {
        .search-hit {
          padding-left: 0;
        }

        .search-hit a {
          display: flex;
          gap: 6px;
        }

        .search-hit svg {
          display: block;
        }
      }

      .search-hit a {
        text-decoration: none;
        color: inherit;
      }

      .search-hit:hover {
        background-color: rgba(207, 207, 207, 1);
      }

      .search-hit ::slotted(h2) {
        font-size: 1.25rem /* 20px */;
        line-height: 1.75rem /* 28px */;
        font-weight: 600;
      }
    </style>
    <li class="search-hit">
      <a>
        <div>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="m17.414 12-7.707 7.707-1.414-1.414L14.586 12 8.293 5.707l1.414-1.414L17.414 12Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div>
          <slot name="title"></slot>
          <slot name="description"></slot>
        </div>
      </a>
    </li>
  </template>`;
}
