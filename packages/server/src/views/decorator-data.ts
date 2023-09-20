import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';

export const DecoratorData = ({ texts }: { texts: Texts }) => html`
  <script type="application/json" id="__DECORATOR__DATA__">
    ${JSON.stringify({ texts })}
  </script>
`;
