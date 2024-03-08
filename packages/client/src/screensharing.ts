import { Environment } from 'decorator-shared/params';
import { loadExternalScript } from './utils';

export const VNGAGE_ID = '83BD7664-B38B-4EEE-8D99-200669A32551' as const;

const CASETYPE_ID = '66D660EF-6F14-44B4-8ADE-A70A127202D0';
const NAV_GROUP_ID = 'A034081B-6B73-46B7-BE27-23B8E9CE3079';
const OPPORTUNITY_ID = '615FF5E7-37B7-4697-A35F-72598B0DC53B';
const SOLUTION_ID = '5EB316A1-11E2-460A-B4E3-F82DBD13E21D';

export const vendorScripts = {
    skjermdeling: `https://account.psplugin.com/${VNGAGE_ID}/ps.js`,
} as const;

export type VngageStates = 'InDialog' | 'Ready';

export type VngageUserState = {
    user: {
        state: VngageStates; // probably more states but couldn't find documentation.
    };
    poi: unknown;
};

// @TODO: Use promise instead of callback?
let hasBeenOpened = false;
export function lazyLoadScreensharing(cb: () => void) {
    // Check if it is already loaded to avoid layout shift
    const enabled = window.__DECORATOR_DATA__.params.shareScreen && window.__DECORATOR_DATA__.features['dekoratoren.skjermdeling'];

    if (!enabled || hasBeenOpened) {
        cb();
        return;
    }

    window.vngageReady = () => {
        cb();
        hasBeenOpened = true;
    };

    loadExternalScript(vendorScripts.skjermdeling);
}

export function useLoadIfActiveSession({ userState }: { userState: string | undefined }) {
    if (userState && userState !== 'Ready') {
        loadExternalScript(vendorScripts.skjermdeling);
    }
}

export function startCall(code: string) {
    window.vngage.join('queue', {
        opportunityId: OPPORTUNITY_ID,
        solutionId: SOLUTION_ID,
        caseTypeId: CASETYPE_ID,
        category: 'Phone2Web',
        message: 'Phone2Web',
        groupId: NAV_GROUP_ID,
        startCode: code,
    });
}
