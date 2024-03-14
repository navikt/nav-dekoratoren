import { Params, type ParamKey, Environment } from 'decorator-shared/params';
import { createEvent } from './events';

const hasParam = (paramKey: ParamKey): boolean => {
    return window.__DECORATOR_DATA__.params[paramKey] !== undefined;
};

const param = <TKey extends keyof Params>(paramKey: TKey) => {
    return window.__DECORATOR_DATA__.params[paramKey] as Params[TKey];
};

const env = <TKey extends keyof Environment>(envKey: TKey): string => {
    return window.__DECORATOR_DATA__.env[envKey] as Environment[TKey];
};

const updateDecoratorParams = (params: Partial<Params>) => {
    const updatedParams = params;

    Object.entries(params).map(([key, value]) => {
        if (param(key as keyof Params) === value) {
            delete updatedParams[key as keyof Params];
        }
    });

    if (Object.keys(updatedParams).length > 0) {
        window.__DECORATOR_DATA__.params = {
            ...window.__DECORATOR_DATA__.params,
            ...updatedParams,
        };

        window.dispatchEvent(
            createEvent('paramsupdated', {
                detail: { params: updatedParams },
            })
        );
    }
};

export { hasParam, param, env, updateDecoratorParams };
