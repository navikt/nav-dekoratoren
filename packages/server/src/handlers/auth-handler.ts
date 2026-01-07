import { Auth, AuthDataResponse, AuthLoggedIn } from "decorator-shared/auth";
import { type Params } from "decorator-shared/params";
import { LeaveIcon } from "decorator-icons";
import { match } from "ts-pattern";
import { logger } from "decorator-shared/logger";
import { clientEnv, env } from "../env/server";
import i18n from "../i18n";
import { fetchNotifications } from "../notifications";
import { HeaderButton } from "../views/components/header-button";
import { ArbeidsgiverUserMenuDropdown } from "../views/header/arbeidsgiver-user-menu-dropdown";
import { UserMenuDropdown } from "../views/header/user-menu-dropdown";
import { SimpleUserMenu } from "../views/simple-user-menu";

const AUTH_API_URL = `${env.DEKORATOREN_API_URL}/auth`;

export const getLogOutUrl = (params: Params) => {
    if (params.logoutUrl) {
        return params.logoutUrl;
    }

    if (params.redirectToUrlLogout) {
        return `${clientEnv.LOGOUT_URL}?redirect=${params.redirectToUrlLogout}`;
    }

    return clientEnv.LOGOUT_URL;
};

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
            logger.error(`Auth error - ${e}`);
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
            const notificationsResult = await fetchNotifications({ cookie });

            return UserMenuDropdown({
                name: auth.name,
                notifications: notificationsResult.ok
                    ? notificationsResult.data
                    : null,
                level: `Level${auth.securityLevel}`,
                loginUrl: env.LOGIN_URL,
                logoutUrl: logoutUrl as string,
                minsideUrl: clientEnv.MIN_SIDE_URL,
                personopplysningerUrl: env.PERSONOPPLYSNINGER_URL,
            });
        })
        .with("arbeidsgiver", async () =>
            ArbeidsgiverUserMenuDropdown({
                href: clientEnv.MIN_SIDE_ARBEIDSGIVER_URL,
                logoutUrl: logoutUrl as string,
                name: auth.name,
            }),
        )
        .with("samarbeidspartner", async () =>
            HeaderButton({
                content: i18n("logout"),
                icon: LeaveIcon(),
                href: logoutUrl,
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
        return { auth: { authenticated: false } };
    }

    const auth = await fetchAuth(cookie);
    if (!auth?.authenticated) {
        return { auth: { authenticated: false } };
    }

    const usermenuHtml = await buildUsermenuHtml(auth, cookie, params);

    return { auth, usermenuHtml };
};
