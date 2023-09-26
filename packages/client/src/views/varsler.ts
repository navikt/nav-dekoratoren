import * as api from '../api';

// @todo:  test in prod

import classes from './varsler.module.css';
import html from 'decorator-shared/html';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';
import { LinkButton } from 'decorator-shared/views/components/link-button';
import { BeskjedIcon, OppgaveIcon } from 'decorator-shared/views/icons/varsler';

type VarslingKanal = 'SMS' | 'EPOST';

type Varsler = {
  tidspunkt: string;
  eventId: string;
  link: string | null;
  eksternVarslingKanaler: VarslingKanal[];
} & (
  | {
      isMasked: true;
    }
  | {
      isMasked: false;
      tekst: string;
    }
);

type VarslerData = {
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

type VarslerPopulatedTexts = {
  varsler_oppgaver_tittel: string;
  varsler_beskjeder_tittel: string;
  beskjed_maskert_tekst: string;
  oppgave_maskert_tekst: string;
  arkiver: string;
  varslet_EPOST: string;
  varslet_SMS: string;
};

export type VarslerPopulatedProps = {
  texts: VarslerPopulatedTexts;
  varslerData: VarslerData;
};

export function VarslerPopulated({
  texts,
  varslerData,
}: VarslerPopulatedProps) {
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
  texts: VarslerPopulatedTexts,
): Omit<VarselProps, 'icon' | 'title'> {
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
    extraClasses: varsel.isMasked ? classes.maskert : '',
  };
}

const makeBeskjed = (
  varsel: Varsler,
  texts: VarslerPopulatedTexts,
): VarselProps => {
  const text = varsel.isMasked ? texts.beskjed_maskert_tekst : varsel.tekst;

  return {
    ...makeVarsel(varsel, texts),
    title: text ?? '',
    icon: BeskjedIcon(),
  };
};

const makeOppgave = (
  varsel: Varsler,
  texts: VarslerPopulatedTexts,
): VarselProps => {
  const text = varsel.isMasked ? texts.oppgave_maskert_tekst : varsel.tekst;

  return {
    ...makeVarsel(varsel, texts),
    title: text ?? '',
    icon: OppgaveIcon(),
  };
};

type VarselProps = {
  title: string;
  timestamp: string;
  icon: string;
  notices: string[];
  cta: string;
  id?: string;
  extraClasses?: string;
};

function Varsel({
  title,
  timestamp,
  icon,
  notices,
  cta,
  id,
  extraClasses = '',
}: VarselProps) {
  return html`
    <li id="${id}">
      <a class="${classes.varsel} ${extraClasses}">
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

function VarselNotice(notice: string) {
  return html`<span class="${classes.varselNotice}">${notice}</span>`;
}

export function attachArkiverListener() {
  const arkiverButtons = document.querySelectorAll('.arkiver-varsel');

  arkiverButtons.forEach((button) => {
    const eventId = button.getAttribute('data-event-id');

    button.addEventListener('click', async () => {
      const resp = await api.inaktiver({
        eventId: eventId as string,
      });

      // Remove the varsel from the dom
      if (resp) {
        const listItem = document.getElementById(eventId as string);
        listItem?.remove();
      }
    });
  });
}
