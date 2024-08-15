import { ClientParams, Environment } from "decorator-shared/params";
import { createEvent } from "./events";

export const hasParam = (paramKey: keyof ClientParams): boolean => {
    return window.__DECORATOR_DATA__.params[paramKey] !== undefined;
};

export const param = <TKey extends keyof ClientParams>(paramKey: TKey) => {
    return window.__DECORATOR_DATA__.params[paramKey] as ClientParams[TKey];
};

export const env = <TKey extends keyof Environment>(envKey: TKey): string => {
    return window.__DECORATOR_DATA__.env[envKey] as Environment[TKey];
};

export const updateDecoratorParams = (params: Partial<ClientParams>) => {
    const updatedParams = params;

    Object.entries(params).map(([key, value]) => {
        if (param(key as keyof ClientParams) === value) {
            delete updatedParams[key as keyof ClientParams];
        }
    });

    if (Object.keys(updatedParams).length > 0) {
        window.__DECORATOR_DATA__.params = {
            ...window.__DECORATOR_DATA__.params,
            ...updatedParams,
        };

        window.dispatchEvent(
            createEvent("paramsupdated", {
                detail: { params: updatedParams },
            }),
        );
    }
};
