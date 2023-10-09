import { initAmplitude, logAmplitudeEvent, logPageView } from './amplitude';
import { AnalyticsEventArgs } from './constants';
// import { initTaskAnalytics } from './task-analytics/ta';

export const initAnalytics = () => {
  console.log('Init analytics');
  initAmplitude();
};

export function analyticsEvent(props: AnalyticsEventArgs) {
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
}

// Connects to partytown forwarding
window.analyticsEvent = analyticsEvent;
window.logPageView = logPageView;
window.logAmplitudeEvent = logAmplitudeEvent;

initAnalytics();
