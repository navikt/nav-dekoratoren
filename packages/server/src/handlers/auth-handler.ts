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
import i18n from "../i18n";
import { getNotifications } from "../notifications";
import { AnchorIconButton } from "../views/anchor-icon-button";
import { ArbeidsgiverUserMenu } from "../views/header/arbeidsgiver-user-menu";
import { UserMenuDropdown } from "../views/header/user-menu-dropdown";
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
    const logoutUrl = getLogOutUrl(params);

    if (params.simple || params.simpleHeader) {
        return SimpleUserMenu({
            logoutUrl,
            name: auth.name,
        }).render(params);
    }

    // @TODO: Tests for important urls, like logout
    const template = await match(params.context)
        .with("privatperson", async () => {
            const notificationsResult = await getNotifications({ cookie });

            return UserMenuDropdown({
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
                href: clientEnv.MIN_SIDE_ARBEIDSGIVER_URL,
            }),
        )
        .with("samarbeidspartner", async () =>
            AnchorIconButton({
                Icon: LogoutIcon({}),
                href: logoutUrl,
                text: i18n("logout"),
            }),
        )
        .exhaustive();

    return template.render(params);
};

export const authHandler = async ({
    params,
    cookie,
}: {
    params: Params;
    cookie: string;
}): Promise<AuthDataResponse> => {
    if (!cookie) {
        return loggedOutResponseData(i18n("login"), params);
    }

    const auth = await fetchAuth(cookie);
    if (!auth?.authenticated) {
        return loggedOutResponseData(i18n("login"), params);
    }

    const usermenuHtml = await buildUsermenuHtml(auth, cookie, params);

    return { auth, usermenuHtml };
};
