import { formatParams } from './json';
import { Environment, Language, Params } from './params';

type IdPortenLocale = 'nb' | 'nn' | 'en' | 'se';

const idPortenLocaleMap: Record<Language, IdPortenLocale> = {
    nb: 'nb',
    nn: 'nn',
    se: 'se',
    en: 'en',
    pl: 'en',
    ru: 'en',
    uk: 'en',
};

export function getIdPortenLocale(language: Language) {
    return idPortenLocaleMap[language];
}

export type DecoratorEndpointFn = (endpoint: string, params: Partial<Params>) => string;

export function makeEndpointFactory(defaultParams: () => Params, origin: string): DecoratorEndpointFn {
    return (endpoint: string, params: Partial<Params>) => {
        const formattedParams = formatParams({
            ...defaultParams(),
            ...params,
        });

        return `${origin}${endpoint}?${formattedParams}`;
    };
}

type GetUrlLoginOptions = {
    environment: Pick<Environment, 'APP_URL' | 'MIN_SIDE_URL' | 'MIN_SIDE_ARBEIDSGIVER_URL' | 'LOGIN_URL'>;
    params: Pick<Params, 'redirectToApp' | 'redirectToUrl' | 'context' | 'level' | 'language'>;
    isClientSide?: boolean;
};

function makeRedirectUrlLogin({ environment, params, isClientSide = false }: GetUrlLoginOptions) {
    const { redirectToUrl, redirectToApp } = params;

    const appUrl = environment.APP_URL;

    if (isClientSide && erNavDekoratoren(appUrl)) {
        return appUrl;
    }

    if (redirectToUrl) {
        return redirectToUrl;
    }

    if (redirectToApp) {
        return appUrl;
    }

    if (params.context === 'arbeidsgiver') {
        return environment.MIN_SIDE_ARBEIDSGIVER_URL;
    }

    return environment.MIN_SIDE_URL;
}

export function makeLoginUrl(
    options: GetUrlLoginOptions & {
        overrideLevel?: string;
    }
) {
    const redirectUrl = makeRedirectUrlLogin(options);
    const idPortenLocale = getIdPortenLocale(options.params.language);

    console.log('idPortenLocale', idPortenLocale);

    const { environment, params } = options;
    return `${environment.LOGIN_URL}?redirect=${redirectUrl}&level=${options.overrideLevel || params.level}&locale=${idPortenLocale}`;
}

export function erNavDekoratoren(url: string) {
    return url.includes('dekoratoren') || url.includes('localhost');
}
