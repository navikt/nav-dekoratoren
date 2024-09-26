import Cookies from "js-cookie";
import { ClientParams, Environment, Language } from "decorator-shared/params";
import { createEvent } from "./events";

type ParamKey = keyof ClientParams;

const CONTEXT_COOKIE = "decorator-context";
const LANGUAGE_COOKIE = "decorator-language";

export const param = (paramKey: keyof ClientParams) => {
    return window.__DECORATOR_DATA__.params[paramKey];
};

export const env = (envKey: keyof Environment) => {
    return window.__DECORATOR_DATA__.env[envKey];
};

export const updateDecoratorParams = (params: Partial<ClientParams>) => {
    const updatedParams = { ...params };

    Object.entries(params).forEach(([key, value]) => {
        if (param(key as ParamKey) === value) {
            delete updatedParams[key as ParamKey];
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

const pathSegmentsToLanguage: Record<string, Language> = {
    nb: "nb",
    no: "nb",
    nn: "nn",
    en: "en",
    se: "se",
} as const;

const getLanguageFromUrl = (): Language | undefined => {
    const pathSegments = window.location.pathname.split("/");

    for (const segment in pathSegments) {
        const language = pathSegmentsToLanguage[segment];

        if (language) {
            return language;
        }
    }
};

export const setInitialParams = () => {
    const language =
        param("language") ||
        getLanguageFromUrl() ||
        (Cookies.get(LANGUAGE_COOKIE) as Language | undefined);

    const context = param("context") || Cookies.get(CONTEXT_COOKIE);

    updateDecoratorParams({ language, context });
};
