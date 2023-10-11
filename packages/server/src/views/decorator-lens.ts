import { Params, formatParams } from 'decorator-shared/params';
import html, { json, unsafeHtml } from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/decorator-lens.module.css';

export function DecoratorLens({
  origin,
  env,
  query,
}: {
  origin: string;
  query: Partial<Params>;
  env: Partial<Params>;
}) {
  return html`
    <div>
      ${DecoratorLensTemplate({ env, query })}
      <div
        id="decorator-lens"
        data-src="${origin}?${unsafeHtml(formatParams(env).toString())}"
      ></div>
      <div id="decorator-lens-implicit"></div>
      <div
        id="decorator-lens-explicit"
        data-src="${unsafeHtml(formatParams(query).toString())}"
      ></div>
      <decorator-lens class="${cls.decoratorLens}"></decorator-lens>
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
        ${json(env)}
      </script>
      <script type="application/json" id="explicit-params">
        ${json(query)}
      </script>
      <div id="decorator-lens-wrapper"></div>
    </template>
  `;
}
