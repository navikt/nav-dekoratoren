import html from 'decorator-shared/html';
import { Params } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';

export const DecoratorData = ({
  texts,
  params,
}: {
  texts: Texts;
  params: Params;
}) => html`
  <script type="application/json" id="__DECORATOR_DATA__">
    ${() => JSON.stringify({ texts, params })}
  </script>
`;
