import { loadExternalScript } from "./utils";

const loadScript = () =>
    loadExternalScript(
        "https://account.psplugin.com/C1302192-8BEC-4EA2-84AB-F4EDE8AC6230/ps.js",
    );

// @TODO: Use promise instead of callback?
let hasBeenOpened = false;
export function lazyLoadScreensharing(cb: () => void) {
    // Check if it is already loaded to avoid layout shift
    const enabled =
        window.__DECORATOR_DATA__.params.shareScreen &&
        window.__DECORATOR_DATA__.features["dekoratoren.skjermdeling"];

    if (!enabled || hasBeenOpened) {
        cb();
        return;
    }

    window.vngageReady = () => {
        cb();
        hasBeenOpened = true;
    };

    loadScript();
}

export function useLoadIfActiveSession({ userState }: { userState?: string }) {
    if (userState && userState !== "Ready") {
        loadScript();
    }
}

export function startCall(code: string) {
    window.vngage.join("queue", {
        opportunityId: "615FF5E7-37B7-4697-A35F-72598B0DC53B",
        solutionId: "5EB316A1-11E2-460A-B4E3-F82DBD13E21D",
        caseTypeId: "66D660EF-6F14-44B4-8ADE-A70A127202D0",
        category: "Phone2Web",
        message: "Phone2Web",
        groupId: "A034081B-6B73-46B7-BE27-23B8E9CE3079",
        startCode: code,
    });
}
