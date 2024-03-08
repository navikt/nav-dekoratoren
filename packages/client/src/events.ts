import { Auth } from './api';
import { Context, Params } from 'decorator-shared/params';

export type MessageEvent = {
    hello: 'true';
};

export type CustomEvents = {
    'analytics-ready-event': void;
    activecontext: { context: Context };
    paramsupdated: {
        params: Partial<Params>;
    };
    authupdated: {
        auth: Auth;
    };
    menuopened: void;
    menuclosed: void;
    clearsearch: void;
    closemenus: void; // Currently fired only from other apps
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
