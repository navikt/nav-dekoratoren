import { Auth } from '../api';
import { analyticsReadyEvent } from '../events';
import { initAmplitude, logAmplitudeEvent, logPageView } from './amplitude';
import { AnalyticsEventArgs } from './constants';
import {
  initTaskAnalytics,
  startTaskAnalyticsSurvey,
} from './task-analytics/ta';

export const initAnalytics = () => {
  initAmplitude();
  initTaskAnalytics();
   window.addEventListener(analyticsReadyEvent, (e) => {
        const response = (e as CustomEvent).detail as Auth;
        window.logPageView(window.__DECORATOR_DATA__.params, response);
        window.startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);
   });
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
