import { environment } from '@/client/environment';
import { Texts } from '@/texts';
import { html } from '@/utils';

export function VarslerEmptyView({ texts }: { texts: Texts }) {
  return html`
    <div id="varsler-empty">
      <img src="/kattIngenVarsler.svg" alt="Ingen varsler" />
      <h1>${texts.varsler_tom_liste}</h1>
      <p>${texts.varsler_tom_liste_ingress}</p>
      <a href="${environment.MIN_SIDE_URL}/tidligere-varsler"
        >${texts.varsler_vis_alle}</a
      >
    </div>
  `;
}
