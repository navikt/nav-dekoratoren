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

    window.__DECORATOR_DATA__.params = {
        ...window.__DECORATOR_DATA__.params,
        ...updatedParams,
    };

    Cookies.set(CONTEXT_COOKIE, param("context"));
    Cookies.set(LANGUAGE_COOKIE, param("language"));

    if (Object.keys(updatedParams).length > 0) {
        window.dispatchEvent(
            createEvent("paramsupdated", {
                detail: { params: updatedParams },
            }),
        );
    }
};

export const initParams = () => {
    const rawParams = window.__DECORATOR_DATA__.rawParams;

    const initialParams: Partial<ClientParams> = {};

    const language =
        rawParams?.language ||
        (Cookies.get(LANGUAGE_COOKIE) as Language | undefined);
    if (language) {
        initialParams.language = language;
    }

    const context =
        rawParams?.context ||
        (Cookies.get(CONTEXT_COOKIE) as Context | undefined);
    if (context) {
        initialParams.context = context;
    }

    updateDecoratorParams(initialParams);
};
