import { Params, type ParamKey, Environment } from 'decorator-shared/params';
import { createEvent } from './events';

const hasParam = (paramKey: ParamKey): boolean => {
    return window.__DECORATOR_DATA__.params[paramKey] !== undefined;
}

const param = <TKey extends keyof Params>(paramKey: TKey) => {
    return window.__DECORATOR_DATA__.params[paramKey] as Params[TKey]
}

const env = <TKey extends keyof Environment>(envKey: keyof Environment): string => {
    return window.__DECORATOR_DATA__.env[envKey] as Environment[TKey];
}

const updateDecoratorParams = (params: Partial<Params>) => {
    window.__DECORATOR_DATA__.params = {
        ...window.__DECORATOR_DATA__.params,
        ...params,
    };

    window.dispatchEvent(
        createEvent('paramsupdated', {
            detail: { keys: Object.keys(params) as ParamKey[] },
        })
    );
};

export {
    hasParam,
    param,
    env,
    updateDecoratorParams,
}
