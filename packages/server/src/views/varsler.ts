import cls from 'decorator-client/src/styles/varsler.module.css';
import html from 'decorator-shared/html';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';
import { LinkButton } from 'decorator-shared/views/components/link-button';
import { BeskjedIcon, OppgaveIcon } from 'decorator-shared/views/icons/varsler';

type VarslingKanal = 'SMS' | 'EPOST';

export type Varsel = {
  tidspunkt: string;
  eventId: string;
  eksternVarslingKanaler: VarslingKanal[];
} & (
  | {
      type: 'oppgave';
      link: string;
    }
  | {
      type: 'beskjed';
      link?: string;
    }
) &
  (
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
    <div class="${cls.varslerPopulated}">
      <div>
        <h2 class="${cls.sectionHeading}">${texts.varsler_oppgaver_tittel}</h2>
        <ul class="${cls.varselList}">
          ${oppgaver.map(
            (oppgave) =>
              html`<li data-event-id="${oppgave.eventId}">
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
      <div>
        <h2 class="${cls.sectionHeading}">${texts.varsler_beskjeder_tittel}</h2>
        <ul class="${cls.varselList}">
          ${beskjeder.map(
            (beskjed) =>
              html`<li data-event-id="${beskjed.eventId}">
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
      <div>
        <a
          class="${cls.tidligereVarsler}"
          href="${process.env.VITE_MIN_SIDE_URL}/tidligere-varsler"
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
  const isArchivable = varsel.type !== 'oppgave' && !varsel.link;
  return html`
    <div
      class="${[cls.varsel, isArchivable ? cls.isArchivable : '']
        .filter(Boolean)
        .join(' ')}"
    >
      <div>
        ${isArchivable
          ? html`<div class="${cls.title}">${title}</div>`
          : html`<a href="${varsel.link}" class="${cls.title}">${title}</a>`}
        <div class="${cls.time}">${formatVarselDate(varsel.tidspunkt)}</div>
      </div>
      <div class="${cls.metaOgKnapp}">
        <div class="${cls.meta}">
          ${icon}
          ${varsel.eksternVarslingKanaler.map(
            (kanal) =>
              html`<span class="${cls.varselNotice}"
                >${texts[`varslet_${kanal}`]}</span
              >`,
          )}
        </div>
        ${isArchivable
          ? LinkButton({
              className: 'arkiver-varsel',
              text: texts.arkiver,
              attrs: `data-event-id="${varsel.eventId}"`,
            })
          : ForwardChevron({ className: cls.forwardChevron })}
      </div>
    </div>
  `;
}
