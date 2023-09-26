import html from '../html';

export type VarslerEmptyProps = {
  texts: {
    varsler_tom_liste: string;
    varsler_tom_liste_ingress: string;
    varsler_vis_alle: string;
  };
};

export function VarslerEmptyView({ texts }: VarslerEmptyProps) {
  return html`
    <div id="varsler-empty">
      <img src="/public/kattIngenVarsler.svg" alt="Ingen varsler" />
      <h1>${texts.varsler_tom_liste}</h1>
      <p>${texts.varsler_tom_liste_ingress}</p>
      <a href="${import.meta.env.VITE_MIN_SIDE_URL}/tidligere-varsler"
        >${texts.varsler_vis_alle}</a
      >
    </div>
  `;
}

export function VarslerUlest() {
  return html` <div class="varsler-ulest"></div> `;
}
