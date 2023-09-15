import { Params, formatParams } from '../params';
import { html } from 'decorator-shared/utils';
import { Request } from 'express';

export function DecoratorLens({
  origin,
  env,
  query,
}: {
  origin: string;
  query: Request['query'];
  env: Partial<Params>;
}) {
  return html`
    <div>
      ${DecoratorLensTemplate({ env, query })}
      <div
        id="decorator-lens"
        data-src="${origin}?${formatParams(env).toString()}"
      ></div>
      <div id="decorator-lens-implicit"></div>
      <div
        id="decorator-lens-explicit"
        data-src="${formatParams(query).toString()}"
      ></div>
      <decorator-lens></decorator-lens>
    </div>
  `;
}

export function DecoratorLensTemplate({
  env,
  query,
}: {
  env: Partial<Params>;
  query: Partial<Params>;
}) {
  return html`
    <template id="decorator-lens-template">
      <style>
        #decorator-lens-wrapper {
            position: fixed;
            bottom: 0px;
            left: 0px;
            width: 100%;
            height: 60vh;
            background-color: rgba(30, 30, 30, 0.9);
            color: white;
            padding: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        #decorator-lens-wrapper
      </style>
      <div id="decorator-lens" data-src=""></div>
      <script type="application/json" id="active-params">
        ${JSON.stringify(env)}
      </script>
      <script type="application/json" id="explicit-params">
        ${JSON.stringify(query)}
      </script>
      <div id="decorator-lens-wrapper"></div>
    </template>
  `;
}
