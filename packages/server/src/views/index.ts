import html from "decorator-shared/html";
import { ScriptsTemplate } from "./scripts";
import { getFeatures } from "../unleash";
import { HeaderTemplate } from "./header/header";
import { FooterTemplate } from "./footer/footer";
import { getSplashPage } from "./splash-page";
import { StylesTemplate } from "./styles";
import { headAssets, HeadAssetsTemplate } from "../head";
import { parseAndValidateParams } from "../validateParams";

type IndexProps = {
    reqParams: Record<string, string>;
    url: string;
};

export const IndexHtml = async ({ reqParams, url }: IndexProps) => {
    const params = parseAndValidateParams(reqParams);
    const features = getFeatures();

    return html`
        <!doctype html>
        <html lang="${params.language}">
            <head>
                <title>NAV Dekoratør</title>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                ${HeadAssetsTemplate()}
            </head>
            <body>
                <div id="styles" style="display:none">${StylesTemplate()}</div>
                <div id="header-withmenu">
                    ${await HeaderTemplate({
                        params,
                        withContainers: true,
                    })}
                </div>
                <main id="maincontent">${getSplashPage(url)}</main>
                <div id="footer-withmenu">
                    ${await FooterTemplate({
                        params,
                        features,
                        withContainers: true,
                    })}
                </div>
                <div id="scripts" style="display:none">
                    ${ScriptsTemplate({
                        params,
                        reqParams: reqParams,
                        features,
                        headAssets,
                    })}
                </div>
                <!-- The elements below are needed for backwards compatibility with certain older implementations -->
                <div id="skiplinks"></div>
                <div id="megamenu-resources"></div>
                <div id="webstats-ga-notrack"></div>
            </body>
        </html>
    `.render(params);
};
