import { Texts } from 'decorator-shared/texts';
import html from 'decorator-shared/html';

export function VarslerEmptyView({ texts }: { texts: Texts }) {
  return html`
    <div id="varsler-empty">
      <img src="/kattIngenVarsler.svg" alt="Ingen varsler" />
      <h1>${texts.varsler_tom_liste}</h1>
      <p>${texts.varsler_tom_liste_ingress}</p>
      <a href="https:/www.nav.no/minside/tidligere-varsler"
        >${texts.varsler_vis_alle}</a
      >
    </div>
  `;
}
