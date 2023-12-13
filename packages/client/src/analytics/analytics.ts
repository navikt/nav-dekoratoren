import { initAmplitude, logAmplitudeEvent, logPageView } from './amplitude';
import { AnalyticsEventArgs } from './constants';
import {
  initTaskAnalytics,
  startTaskAnalyticsSurvey,
} from './task-analytics/ta';

export const initAnalytics = () => {
  console.log('initAnalytics');
  initAmplitude();
  initTaskAnalytics();
};

// Connects to partytown forwarding
window.analyticsEvent = function (props: AnalyticsEventArgs) {
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
window.logPageView = logPageView;
window.logAmplitudeEvent = logAmplitudeEvent;
window.startTaskAnalyticsSurvey = startTaskAnalyticsSurvey;

initAnalytics();
