import { initAmplitude, logAmplitudeEvent } from './amplitude';
// import { initTaskAnalytics } from './task-analytics/ta';

console.log('Index file');

export enum MenuValue {
  PRIVATPERSON = 'privatperson',
  ARBEIDSGIVER = 'arbeidsgiver',
  SAMARBEIDSPARTNER = 'samarbeidspartner',
  IKKEBESTEMT = 'IKKEBESTEMT',
}

export enum AnalyticsCategory {
  Header = 'dekorator-header',
  Footer = 'dekorator-footer',
  Meny = 'dekorator-meny',
}

export type AnalyticsEventArgs = {
  eventName?: string;
  category: AnalyticsCategory;
  action: string;
  context?: MenuValue;
  destination?: string;
  label?: string;
  komponent?: string;
  lenkegruppe?: string;
};

export const initAnalytics = () => {
  console.log('Inited analytics');
  initAmplitude();
};

export const analyticsEvent = (props: AnalyticsEventArgs) => {
  const {
    context,
    eventName,
    destination,
    category,
    action,
    label,
    komponent,
    lenkegruppe,
  } = props;
  const actionFinal = `${context ? context + '/' : ''}${action}`;

  logAmplitudeEvent(
    eventName || 'navigere',
    {
      destinasjon: destination || label,
      søkeord: eventName === 'søk' ? '[redacted]' : undefined,
      lenketekst: actionFinal,
      kategori: category,
      komponent: komponent || action,
      lenkegruppe,
    },
    'decorator_next',
  );
};

initAnalytics();

const amplitudeTest = document.querySelector('#amplitude-test');
console.log(amplitudeTest);

amplitudeTest?.addEventListener('click', () => {
  logAmplitudeEvent(
    'decorator_next 🚀',
    {
      destinasjon: 'test',
      kategori: 'test',
    },
    'decorator_next',
  );
  console.log('Clicked the button');
});
