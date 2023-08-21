import { html } from '@/utils';

export class Loader extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const title = this.getAttribute('title') ?? 'Laster forhåndsvisning';

    shadowRoot.innerHTML = html`
      <style>
        @keyframes loader-rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-dasharray {
          0% {
            stroke-dasharray: 1px, 200px;
            stroke-dashoffset: 0;
          }

          50% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -15px;
          }

          100% {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -120px;
          }
        }

        .dekorator-loader-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .dekorator-loader {
          width: 4rem;
          display: inline-block;
          animation: loader-rotate 1.8s linear infinite;
          stroke-width: 5;
          height: 4rem;
        }

        .dekoratoren-loader__foreground {
          animation: loader-dasharray 1.8s ease-in-out infinite;
          stroke-dasharray: 80px, 200px;
          stroke-dashoffset: 0;
          stroke: var(--ac-loader-stroke, var(--a-border-default));
        }

        .dekoratoren-loader__background {
          stroke: var(--ac-loader-stroke-bg, var(--a-surface-active));
          stroke-width: var(--ac-loader-background-stroke-width);
        }

        .title {
          margin-bottom: var(--a-spacing-2);
        }
      </style>
      <div class="dekorator-loader-container">
        <span class="title">${title}</span>
        <svg
          class="dekorator-loader"
          focusable="false"
          viewBox="0 0 50 50"
          preserveAspectRatio="xMidYMid"
        >
          <!-- For accessibility. -->
          <title>${title}</title>
          <circle
            class="dekoratoren-loader__background"
            xmlns="http://www.w3.org/2000/svg"
            cx="25"
            cy="25"
            r="20"
            fill="none"
          />
          <circle
            class="dekoratoren-loader__foreground"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeDasharray="50 155"
          />
        </svg>
      </div>
    `;
  }
}

customElements.define('decorator-loader', Loader);
