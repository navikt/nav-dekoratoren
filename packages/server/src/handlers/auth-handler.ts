import {
    Auth,
    AuthDataResponse,
    AuthLoggedIn,
    getLogOutUrl,
    loggedOutResponseData,
} from "decorator-shared/auth";
import { type Params } from "decorator-shared/params";
import { LogoutIcon } from "decorator-shared/views/icons/logout";
import { match } from "ts-pattern";
import { clientEnv, env } from "../env/server";
import { getNotifications } from "../notifications";
import { texts } from "../texts";
import { ArbeidsgiverUserMenu } from "../views/header/arbeidsgiver-user-menu";
import { UserMenuDropdown } from "../views/header/user-menu-dropdown";
import { AnchorIconButton } from "../views/icon-button";
import { SimpleUserMenu } from "../views/simple-user-menu";

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
    cookie: string,
    params: Params,
) => {
    const localTexts = texts[params.language];
    const logoutUrl = getLogOutUrl(params);

    if (params.simple || params.simpleHeader) {
        return SimpleUserMenu({
            logoutUrl,
            texts: localTexts,
            name: auth.name,
        }).render();
    }

    // @TODO: Tests for important urls, like logout
    const template = await match(params.context)
        .with("privatperson", async () => {
            const notificationsResult = await getNotifications({ cookie });

            return UserMenuDropdown({
                texts: localTexts,
                name: auth.name,
                notifications: notificationsResult.ok
                    ? notificationsResult.data
                    : null,
                level: `Level${auth.securityLevel}`,
                loginUrl: clientEnv.LOGIN_URL,
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

export const authHandler = async ({
    params,
    cookie,
}: {
    params: Params;
    cookie: string;
}): Promise<AuthDataResponse> => {
    if (!cookie) {
        return loggedOutResponseData(texts[params.language].login);
    }

    const auth = await fetchAuth(cookie);
    if (!auth?.authenticated) {
        return loggedOutResponseData(texts[params.language].login);
    }

    const usermenuHtml = await buildUsermenuHtml(auth, cookie, params);

    return { auth, usermenuHtml };
};
