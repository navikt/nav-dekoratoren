import amplitude from 'amplitude-js';
import { Params } from 'decorator-shared/params';
import { Auth } from '../api';

type EventData = Record<string, any>;

declare global {
    interface Window {
        dekoratorenAmplitude: typeof logEventFromApp;
    }
}

export const initAmplitude = () => {
    const userProps = {
        skjermbredde: window.screen.width,
        skjermhoyde: window.screen.height,
        vindusbredde: window.innerWidth,
        vindushoyde: window.innerHeight,
    };

    amplitude.init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        includeUtm: true,
        includeReferrer: true,
        platform: window.location.toString(),
    });
    amplitude.getInstance().setUserProperties(userProps);

    window.dekoratorenAmplitude = logEventFromApp;
};

const logEventFromApp = (params?: { origin: unknown | string; eventName: unknown | string; eventData?: unknown | EventData }): Promise<any> => {
    try {
        if (!params || params.constructor !== Object) {
            return Promise.reject('Argument must be an object of type {origin: string, eventName: string, eventData?: Record<string, any>}');
        }

        const { origin, eventName, eventData = {} } = params;
        if (!eventName || typeof eventName !== 'string') {
            return Promise.reject('Parameter "eventName" must be a string');
        }
        if (!origin || typeof origin !== 'string') {
            return Promise.reject('Parameter "origin" must be a string');
        }
        if (!eventData || eventData.constructor !== Object) {
            return Promise.reject('Parameter "eventData" must be a plain object');
        }

        return logAmplitudeEvent(eventName, eventData, origin);
    } catch (e) {
        return Promise.reject(`Unexpected Amplitude error: ${e}`);
    }
};

export const logPageView = (params: Params, authState: Auth) => {
    console.log('Logging page view', params, authState);
    return logAmplitudeEvent('besøk', {
        sidetittel: document.title,
        innlogging: authState.authenticated ? authState.securityLevel : false,
        parametre: {
            ...params,
            BREADCRUMBS: params.breadcrumbs && params.breadcrumbs.length > 0,
            ...(params.availableLanguages && {
                availableLanguages: params.availableLanguages.map((lang) => lang.locale),
            }),
        },
    });
};

export const logAmplitudeEvent = (eventName: string, eventData: EventData = {}, origin = 'decorator-next') => {
    return new Promise((resolve) => {
        amplitude.getInstance().logEvent(
            eventName,
            {
                ...eventData,
                platform: window.location.toString(),
                origin,
                originVersion: eventData.originVersion || 'unknown',
                viaDekoratoren: true,
                fromNext: true,
            },
            resolve
        );
    });
};
