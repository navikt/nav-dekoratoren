import { formatParams } from './json';
import { Environment, Params } from './params';

export function makeEndpointFactory(defaultParams: () => Params, origin: string) {
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
    params: Pick<Params, 'redirectToApp' | 'redirectToUrl' | 'context' | 'level'>;
    isClientSide?: boolean;
};

// @TODO: I'm pretty sure we can just supply this to the client from the server
// Maybe an extra field in app_state
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

    const { environment, params } = options;
    return `${environment.LOGIN_URL}?redirect=${redirectUrl}&level=${options.overrideLevel || params.level}`;
}

export function erNavDekoratoren(url: string) {
    return url.includes('dekoratoren') || url.includes('localhost');
}
