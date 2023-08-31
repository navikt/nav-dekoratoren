import { formatParams } from '@/client/get-content';
import { Params } from '@/params';
import { html } from '@/utils';

export function DecoratorEnv({
  origin,
  env,
}: {
  origin: string;
  env: Partial<Params>;
}) {
  return html`
    <div
      id="decorator-env"
      data-src="${origin}?${formatParams(env).toString()}"
    ></div>
    <script type="application/javascript" id="decorator-params">
      ${JSON.stringify(env)};
    </script>
  `;
}
