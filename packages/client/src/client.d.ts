import { AppState } from 'decorator-shared/types';
import { Faro } from '@grafana/faro-web-sdk';
import { EventName, CustomEvents, MessageEvents } from './events';


declare global {
  interface Window {
    __DECORATOR_DATA__: AppState;
    loginDebug: {
      expireToken: (seconds: number) => void;
      expireSession: (seconds: number) => void;
    };
    analyticsEvent: (props: AnalyticsEventArgs) => void;
    logPageView: (params: Params, authState: Auth) => Promise<unknown>;
    logAmplitudeEvent: (
      eventName: string,
      eventData: Record<string, any>,
      origin?: string,
    ) => void;
    startTaskAnalyticsSurvey: (state: AppState) => void;
    // For task analytics, should have better types?
    TA: any;
    dataLayer: any;
    vngageReady: () => void;
    vngage: {
        join: (queue: string, options: unknown) => void;
    },
    faro?: Faro,
    addEventListener(type: 'message',
           listener: (this: Document, ev: MessageEvent<MessageEvents>) => void): void;
    addEventListener<K extends keyof CustomEvents>(type: K,
           listener: (this: Document, ev: CustomEvent<CustomEvents[K]>) => void): void;

  }
}
