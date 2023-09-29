import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';

// @todo:  test in prod
import classes from '../styles/varsler.module.css';
import html from 'decorator-shared/html';
import { LinkButton } from 'decorator-shared/views/components/link-button';
import { BeskjedIcon, OppgaveIcon } from 'decorator-shared/views/icons/varsler';
import { Texts } from 'decorator-shared/types';
import { getLoginUrl } from '../helpers/urls';

export type VarselType = 'beskjeder' | 'innboks';
type VarslingKanal = 'SMS' | 'EPOST';

export type Varsler = {
  type: VarselType;
  tidspunkt: string;
  eventId: string;
  tekst: string;
  link: string;
  isMasked: boolean;
  eksternVarslingKanaler: VarslingKanal[];
};

export type VarslerData = {
  oppgaver: Varsler[];
  beskjeder: Varsler[];
};

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
      <img src="/public/kattIngenVarsler.svg" alt="Ingen varsler" />
      <h1>${texts.varsler_tom_liste}</h1>
      <p>${texts.varsler_tom_liste_ingress}</p>
      <a href="${window.decoratorEnvironment.MIN_SIDE_URL}/tidligere-varsler"
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
  const { beskjeder, oppgaver } = varslerData;

  return html`
    <div id="varsler-populated">
      <div id="varsler-populated-oppgaver">
        <p class="title">${texts.varsler_oppgaver_tittel}</p>
        <ul>
          ${oppgaver.map((oppgave) => {
            return Varsel(makeOppgave(oppgave, texts));
          })}
        </ul>
      </div>
      <div id="varsler-populated-beskjeder">
        <p class="title">${texts.varsler_beskjeder_tittel}</p>
        <ul>
          ${beskjeder.map((beskjed) => {
            return Varsel(makeBeskjed(beskjed, texts));
          })}
        </ul>
      </div>
      <div class="${classes.tidligereVarslerContainer}">
        <a
          class="${classes.tidligereVarsler}"
          href="${import.meta.env.VITE_MIN_SIDE_URL}/tidligere-varsler"
        >
          Tidligere varsler
        </a>
      </div>
    </div>
  `;
}

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

function makeVarsel(
  varsel: Varsler,
  texts: Texts,
): Omit<VarselProps, 'icon' | 'title' | 'href'> {
  const cta = varsel.isMasked
    ? ForwardChevron()
    : LinkButton({
        className: 'arkiver-varsel',
        text: texts.arkiver,
        attrs: `data-event-id="${varsel.eventId}"`,
      });

  return {
    timestamp: formatVarselDate(varsel.tidspunkt),
    cta,
    id: varsel.eventId,
    notices: varsel.eksternVarslingKanaler.map((kanal) => {
      return texts[`varslet_${kanal}`];
    }),
    kind: varsel.type,
    extraClasses: varsel.isMasked ? classes.maskert : '',
  };
}

const makeBeskjed = (varsel: Varsler, texts: Texts): VarselProps => {
  const text = varsel.isMasked ? texts.beskjed_maskert_tekst : varsel.tekst;

  return {
    ...makeVarsel(varsel, texts),
    title: text,
    icon: BeskjedIcon(),
    href: varsel.isMasked
      ? getLoginUrl(
          window.decoratorEnvironment,
          window.decoratorParams,
          window.decoratorParams.context,
          'Level4',
        )
      : varsel.link,
  };
};

const makeOppgave = (varsel: Varsler, texts: Texts): VarselProps => {
  const text = varsel.isMasked ? texts.oppgave_maskert_tekst : varsel.tekst;

  return {
    ...makeVarsel(varsel, texts),
    title: text,
    icon: OppgaveIcon(),
    href: varsel.isMasked
      ? getLoginUrl(
          window.decoratorEnvironment,
          window.decoratorParams,
          window.decoratorParams.context,
          'Level4',
        )
      : varsel.link,
  };
};

type VarselProps = {
  title: string;
  timestamp: string;
  icon: string;
  notices: string[];
  cta: string;
  id?: string;
  href: string;
  kind?: string;
  extraClasses?: string;
};

export function Varsel({
  title,
  timestamp,
  icon,
  notices,
  cta,
  href,
  kind,
  id,
  extraClasses = '',
}: VarselProps) {
  return html`
    <li id="${id}" data-kind="${kind}" data-href="${href}">
      <a class="${classes.varsel} ${extraClasses}" href="${href}">
        <h3 class="${classes.title}">${title}</h3>
        <p class="${classes.timestamp}">${timestamp}</p>
        <div class="${classes.metaOgKnapp}">
          <div class="${classes.meta}">
            ${icon} ${notices.map(VarselNotice)}
          </div>
          ${cta}
        </div>
      </a>
    </li>
  `;
}

export function makeVarselAmplitudeEvent(kind: VarselType, href: string) {
  return {
    komponent:
      kind.toLowerCase() == 'beskjed' ? 'varsel-beskjed' : 'varsel-oppgave',
    kategori: 'varselbjelle',
    destinasjon: href,
  };
}

function VarselNotice(notice: string) {
  return html`<span class="${classes.varselNotice}">${notice}</span>`;
}
