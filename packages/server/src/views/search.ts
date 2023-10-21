import html from 'decorator-shared/html';

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
