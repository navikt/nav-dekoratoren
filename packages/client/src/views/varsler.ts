import * as api from '../api';
import classes from './varsler.module.css';
import html from 'decorator-shared/html';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';
import { LinkButton } from 'decorator-shared/views/components/link-button';
import { BeskjedIcon, OppgaveIcon } from 'decorator-shared/views/icons/varsler';

type VarslingKanal = 'SMS' | 'EPOST';

type Varsel = {
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
  oppgaver: Varsel[];
  beskjeder: Varsel[];
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

export type VarslerPopulatedProps = {
  texts: {
    varsler_oppgaver_tittel: string;
    varsler_beskjeder_tittel: string;
    beskjed_maskert_tekst: string;
    oppgave_maskert_tekst: string;
    arkiver: string;
    varslet_EPOST: string;
    varslet_SMS: string;
  };
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
        <h2 class="title">${texts.varsler_oppgaver_tittel}</h2>
        <ul>
          ${oppgaver.map(
            (oppgave) =>
              html`<li>
                ${Varsel({
                  title: oppgave.isMasked
                    ? texts.oppgave_maskert_tekst
                    : oppgave.tekst,
                  icon: OppgaveIcon(),
                  varsel: oppgave,
                  texts,
                })}
              </li>`,
          )}
        </ul>
      </div>
      <div id="varsler-populated-beskjeder">
        <h2 class="title">${texts.varsler_beskjeder_tittel}</h2>
        <ul>
          ${beskjeder.map(
            (beskjed) =>
              html`<li>
                ${Varsel({
                  title: beskjed.isMasked
                    ? texts.beskjed_maskert_tekst
                    : beskjed.tekst,
                  icon: BeskjedIcon(),
                  varsel: beskjed,
                  texts,
                })}
              </li>`,
          )}
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

function Varsel({
  title,
  icon,
  varsel,
  texts,
}: {
  title: string;
  icon: string;
  varsel: Varsel;
  texts: {
    arkiver: string;
    varslet_EPOST: string;
    varslet_SMS: string;
  };
}) {
  return html`
    <div
      class="${[classes.varsel, varsel.isMasked ? classes.maskert : '']
        .filter(Boolean)
        .join(' ')}"
    >
      <a href="${varsel.link}" class="${classes.title}"><h3>${title}</h3></a>
      <p class="${classes.timestamp}">${formatVarselDate(varsel.tidspunkt)}</p>
      <div class="${classes.metaOgKnapp}">
        <div class="${classes.meta}">
          ${icon}
          ${varsel.eksternVarslingKanaler.map(
            (kanal) =>
              html`<span class="${classes.varselNotice}"
                >${texts[`varslet_${kanal}`]}</span
              >`,
          )}
        </div>
        ${varsel.isMasked
          ? ForwardChevron()
          : LinkButton({
              className: 'arkiver-varsel',
              text: texts.arkiver,
              attrs: `data-event-id="${varsel.eventId}"`,
            })}
      </div>
    </div>
  `;
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
