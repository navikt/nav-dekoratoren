import { Auth } from './api';
import { Context, Params, type ParamKey } from 'decorator-shared/params';

export type MessageEvent = {
    hello: 'true';
};

export type CustomEvents = {
    'analytics-ready-event': void;
    'analytics-load-event': Auth;
    activecontext: { context: Context };
    paramsupdated: {
        params: Partial<Params>;
    };
};

export type MessageEvents =
    | {
          source: 'decoratorClient';
          event: 'ready';
      }
    | {
          source: 'decoratorClient';
          event: 'params';
          payload: Partial<Params>;
      };

export type EventName = keyof CustomEvents;

export function createEvent<TName extends keyof CustomEvents>(name: TName, options: CustomEventInit<CustomEvents[TName]>) {
    return new CustomEvent(name, options);
}

export const analyticsReady = new CustomEvent('analytics-ready-event', {
    bubbles: true,
});

export type AnalyticsLoaded = CustomEvent<Auth>;

export const analyticsLoaded = new CustomEvent<Auth>('analytics-loaded-event', {
    bubbles: true,
});
