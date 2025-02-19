import { Faro } from "@grafana/faro-web-sdk";
import { AppState } from "decorator-shared/types";
import { CustomEvents, MessageEvents } from "./events";
import { BoostClient, BoostConfig } from "./views/chatbot";
import { WebStorageController } from "./webStorage";

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
        dataLayer: any;
        boostInit?: (env: string, config: BoostConfig) => BoostClient;
        vngage: {
            join: (queue: string, options: unknown) => void;
            subscribe: (
                type: string,
                callback: (message: string, data: unknown) => void,
            ) => void;
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
        initConditionalHotjar: () => void;
        initConditionalTaskAnalytics: () => void;
    }
}
