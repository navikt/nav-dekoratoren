import html, { json } from 'decorator-shared/html';
import { Params } from 'decorator-shared/params';
import { Features, Texts } from 'decorator-shared/types';

// @TODO: For after NITD. Features should be loaded on the client to avoid caching.
export const DecoratorData = ({
  texts,
  params,
  features,
}: {
  texts: Texts;
  params: Params;
  features: Features;
}) => html`
  <script type="application/json" id="__DECORATOR_DATA__">
    ${json({ texts, params, features })}
  </script>
`;
