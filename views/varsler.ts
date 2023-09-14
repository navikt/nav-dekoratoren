import { environment } from '@/client/environment';
import { Texts } from '@/texts';
import { html } from '@/utils';
import { BeskjedIcon } from './icons/varsler';
import { ForwardChevron } from './icons/forward-chevron';

export type VarselType = 'beskjeder' | 'innboks';

export type Varsler = {
  type: VarselType;
  tidspunkt: string;
  eventId: string;
  tekst: string;
  link: string;
  isMasked: boolean;
  eksternVarslingKanaler: string[];
};

//154939

export type VarslerData = {
  oppgaver: Varsler[];
  beskjeder: Varsler[];
};

function formatVarselDate(tidspunkt: string): string {
  const date = new Date(tidspunkt);
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const;
  return date.toLocaleDateString('nb-NO', options).replace(':', '.');
}

export async function fetchVarsler() {
  const response = await fetch(
    `${import.meta.env.VITE_DECORATOR_BASE_URL}/api/varsler`,
    {
      credentials: 'include',
    },
  );

  const varsler = (await response.json()) as VarslerData;

  if (!varsler || (!varsler.beskjeder.length && !varsler.oppgaver.length))
    return;

  return varsler;
}

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

export function VarslerUlest() {
  return html` <div class="varsler-ulest"></div> `;
}

export function VarslerPopulated({
  texts,
  varslerData,
}: {
  texts: Texts;
  varslerData: VarslerData;
}) {
  const { beskjeder } = varslerData;

  return html`
    <div id="varsler-populated">
      <div id="varsler-populated-beskjeder">
        <p class="title">${texts.varsler_beskjeder_tittel}</p>
        <ul>
          ${beskjeder.map((beskjed) => {
            return Varsel({
              title: beskjed.tekst,
              timestamp: formatVarselDate(beskjed.tidspunkt),
              icon: BeskjedIcon(),
            });
          })}
        </ul>
        <div></div>
      </div>
    </div>
  `;
}

export function Varsel({
  title,
  timestamp,
  icon,
}: {
  title: string;
  timestamp: string;
  icon?: string;
}) {
  return html`
    <li>
      <a class="varsel-beskjed">
        <h3>${title}</h3>
        <p>${timestamp}</p>
        <div class="meta-og-knapp">${icon} ${ForwardChevron()}</div>
      </a>
    </li>
  `;
}
