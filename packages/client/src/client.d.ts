import type { Faro } from "@grafana/faro-web-sdk";
import { AppState } from "decorator-shared/types";
import { CustomEvents, MessageEvents } from "./events";
import { WebStorageController } from "./webStorage";

type CustomEventMap = {
    conversationIdChanged: CustomEvent<{ conversationId?: string }>;
    chatPanelClosed: CustomEvent<undefined>;
    setFilterValue: CustomEvent<{ filterValue: string[]; nextId?: number }>;
};

export type BoostClient = {
    chatPanel: {
        show: () => void;
        addEventListener: <K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void,
        ) => void;
        dispatchEvent: (event: CustomEventMap[keyof CustomEventMap]) => void;
        setFilterValues: (filterValues: string[]) => void;
        triggerAction: (actionId: number) => void;
    };
};

declare global {
    interface Window {
        __DECORATOR_DATA__: AppState;
        loginDebug: {
            expireToken: (seconds: number) => void;
            expireSession: (seconds: number) => void;
        };
        // For task analytics, should have better types?
        TA: any;
        hj: any;
        _hjSettings: any;
        hjBootstrap: any;
        hjBootstrapCalled: any;
        hjLazyModules: any;
        hjSiteSettings: any;
        skyra?: any;
        SKYRA_CONFIG?: {
            org: string;
            cookieConsent: boolean;
        };
        skyraSurvey: any;
        dataLayer: any;
        boostInit?: (env: string, config: any) => BoostClient;
        vngage: {
            join: (queue: string, options: unknown) => void;
            subscribe: (
                type: string,
                callback: (message: string, data: unknown) => void,
            ) => void;
        };
        // Bare definert de typene som brukes, ikke alle som finnes
        pzl?: {
            info?: {
                status: string;
            };
            api: {
                showInteraction: ({
                    interactionId: string,
                    queueKey: string,
                    formValues: { pzlStartChatCode: string },
                }) => void;
            };
        };
        faro?: Faro;
        addEventListener(
            type: "message",
            listener: (this: Document, ev: MessageEvent<MessageEvents>) => void,
        ): void;
        addEventListener<K extends keyof CustomEvents>(
            type: K,
            listener: (
                this: Document,
                ev: CustomEvent<CustomEvents[K]>,
            ) => void,
        ): void;
        removeEventListener(
            type: "message",
            listener: (this: Document, ev: MessageEvent<MessageEvents>) => void,
        ): void;
        removeEventListener<K extends keyof CustomEvents>(
            type: K,
            listener: (
                this: Document,
                ev: CustomEvent<CustomEvents[K]>,
            ) => void,
        ): void;
        webStorageController: WebStorageController;
        initConditionalTaskAnalytics: () => void;
        dekoratorenIsReady?: () => true;
    }
}
