import Cookies from "js-cookie";
import {
    ClientParams,
    Context,
    Environment,
    Language,
} from "decorator-shared/params";
import { createEvent } from "./events";

type ParamKey = keyof ClientParams;
type EnvKey = keyof Environment;

const CONTEXT_COOKIE = "decorator-context";
const LANGUAGE_COOKIE = "decorator-language";

export const param = <TKey extends ParamKey>(paramKey: TKey) => {
    return window.__DECORATOR_DATA__.params[paramKey];
};

export const env = <TKey extends EnvKey>(envKey: TKey) => {
    return window.__DECORATOR_DATA__.env[envKey];
};

export const updateDecoratorParams = (params: Partial<ClientParams>) => {
    const updatedParams = { ...params };

    Object.entries(params).forEach(([key, value]) => {
        if (param(key as ParamKey) === value) {
            delete updatedParams[key as ParamKey];
        }
    });

    if (Object.keys(updatedParams).length === 0) {
        return;
    }

    window.__DECORATOR_DATA__.params = {
        ...window.__DECORATOR_DATA__.params,
        ...updatedParams,
    };

    const { context, language } = updatedParams;

    if (context) {
        Cookies.set(CONTEXT_COOKIE, context);
    }

    if (language) {
        Cookies.set(LANGUAGE_COOKIE, language);
    }

    window.dispatchEvent(
        createEvent("paramsupdated", {
            detail: { params: updatedParams },
        }),
    );
};

export const setInitialParams = () => {
    const reqParams = window.__DECORATOR_DATA__.reqParams;

    const language =
        reqParams?.language ||
        (Cookies.get(LANGUAGE_COOKIE) as Language | undefined);

    const context =
        reqParams?.context ||
        (Cookies.get(CONTEXT_COOKIE) as Context | undefined);

    updateDecoratorParams({ language, context });
};
