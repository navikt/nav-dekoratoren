import { HandlerFunction, responseBuilder } from "../lib/handler";
import { clientEnv, env } from "../env/server";
import { validParams } from "../validateParams";
import { texts } from "../texts";
import {
    Auth,
    AuthDataResponse,
    AuthLoggedIn,
    getLogOutUrl,
} from "decorator-shared/auth";
import { SimpleUserMenu } from "../views/simple-user-menu";
import { match } from "ts-pattern";
import { UserMenuDropdown } from "../views/header/user-menu-dropdown";
import { getNotifications } from "../notifications";
import { ArbeidsgiverUserMenu } from "../views/header/arbeidsgiver-user-menu";
import { AnchorIconButton } from "../views/icon-button";
import { LogoutIcon } from "decorator-shared/views/icons/logout";

const notAuthenticatedResponse: AuthDataResponse = {
    auth: {
        authenticated: false,
    },
};

const AUTH_API_URL = `${env.API_DEKORATOREN_URL}/auth`;

const fetchAuth = async (cookiesHeader: string): Promise<Auth | null> => {
    return fetch(AUTH_API_URL, {
        headers: {
            "Cache-Control": "no-cache",
            Cookie: cookiesHeader,
        },
    })
        .then((res) => {
            if (res.ok) {
                return res.json() as Promise<Auth>; // TODO: validate response
            }

            throw Error(
                `Bad response from auth api - ${res.status} ${res.statusText}`,
            );
        })
        .catch((e) => {
            console.error(`Auth error - ${e}`);
            return null;
        });
};

const buildUsermenuHtml = async (
    auth: AuthLoggedIn,
    request: Request,
    query: Record<string, string>,
) => {
    const data = validParams(query);
    const localTexts = texts[data.language];
    const logoutUrl = getLogOutUrl(data);

    if (data.simple) {
        return SimpleUserMenu({
            logoutUrl,
            texts: localTexts,
            name: auth.name,
        });
    }

    // @TODO: Tests for important urls, like logout
    const template = await match(data.context)
        .with("privatperson", async () =>
            UserMenuDropdown({
                texts: localTexts,
                name: auth.name,
                notifications: await getNotifications({ request }),
                level: `Level${auth.securityLevel}`,
                logoutUrl: logoutUrl as string,
                minsideUrl: clientEnv.MIN_SIDE_URL,
                personopplysningerUrl: clientEnv.PERSONOPPLYSNINGER_URL,
            }),
        )
        .with("arbeidsgiver", async () =>
            ArbeidsgiverUserMenu({
                texts: localTexts,
                href: clientEnv.MIN_SIDE_ARBEIDSGIVER_URL,
            }),
        )
        .with("samarbeidspartner", async () =>
            AnchorIconButton({
                Icon: LogoutIcon({}),
                href: logoutUrl,
                text: localTexts.logout,
            }),
        )
        .exhaustive();

    return template.render();
};

export const authHandler: HandlerFunction = async ({ request, query }) => {
    const response = responseBuilder();

    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
        return response.json(notAuthenticatedResponse).build();
    }

    const auth = await fetchAuth(cookieHeader);
    if (!auth?.authenticated) {
        return response.json(notAuthenticatedResponse).build();
    }

    const usermenuHtml = await buildUsermenuHtml(auth, request, query);

    return response.json({ auth, usermenuHtml }).build();
};
