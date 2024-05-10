import { HandlerFunction, responseBuilder } from "../lib/handler";
import { clientEnv, env } from "../env/server";
import { validParams } from "../validateParams";
import { texts } from "../texts";
import {
    Auth,
    AuthLoggedIn,
    getLogOutUrl,
    loggedOutResponseData,
} from "decorator-shared/auth";
import { SimpleUserMenu } from "../views/simple-user-menu";
import { match } from "ts-pattern";
import { UserMenuDropdown } from "../views/header/user-menu-dropdown";
import { getNotifications } from "../notifications";
import { ArbeidsgiverUserMenu } from "../views/header/arbeidsgiver-user-menu";
import { AnchorIconButton } from "../views/icon-button";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import html from "decorator-shared/html";
import { Language, type Params } from "decorator-shared/params";

const notAuthenticatedResponse = (language: Language) =>
    responseBuilder()
        .json(loggedOutResponseData(texts[language].login))
        .build();

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
    params: Params,
) => {
    const localTexts = texts[params.language];
    const logoutUrl = getLogOutUrl(params);

    if (params.simple) {
        return SimpleUserMenu({
            logoutUrl,
            texts: localTexts,
            name: auth.name,
        });
    }

    // @TODO: Tests for important urls, like logout
    const template = await match(params.context)
        .with("privatperson", async () => {
            const notificationsResult = await getNotifications({
                request,
            });
            if (!notificationsResult.ok) {
                return html` <div>Error</div>`;
            }

            return UserMenuDropdown({
                texts: localTexts,
                name: auth.name,
                notifications: notificationsResult.data,
                level: `Level${auth.securityLevel}`,
                logoutUrl: logoutUrl as string,
                minsideUrl: clientEnv.MIN_SIDE_URL,
                personopplysningerUrl: clientEnv.PERSONOPPLYSNINGER_URL,
            });
        })
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
    const params = validParams(query);

    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
        return notAuthenticatedResponse(params.language);
    }

    const auth = await fetchAuth(cookieHeader);
    if (!auth?.authenticated) {
        return notAuthenticatedResponse(params.language);
    }

    const usermenuHtml = await buildUsermenuHtml(auth, request, params);

    return responseBuilder().json({ auth, usermenuHtml }).build();
};
