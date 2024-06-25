import { loadExternalScript } from "./utils";
import { env } from "./params";

// @TODO: Use promise instead of callback?
let hasBeenOpened = false;

const loadScript = () =>
    loadExternalScript(
        `https://account.psplugin.com/${env("PUZZEL_CUSTOMER_ID")}/ps.js`,
    );

export function lazyLoadScreensharing(callback: () => void) {
    // Check if it is already loaded to avoid layout shift
    const enabled =
        window.__DECORATOR_DATA__.params.shareScreen &&
        window.__DECORATOR_DATA__.features["dekoratoren.skjermdeling"];

    if (!enabled || hasBeenOpened) {
        callback();
        return;
    }

    loadScript().then(() => {
        if (!window.vngage) {
            console.error("vngage not found!");
            return;
        }

        window.vngage.subscribe(
            "app.ready",
            (message: string, data: unknown) => {
                console.log("app.ready:", message, data);

                callback();
                hasBeenOpened = true;
            },
        );
    });
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
