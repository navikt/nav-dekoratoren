import html, { json, Template, unsafeHtml } from "decorator-shared/html";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import {
    ClientTexts,
    clientTextsKeys,
    Features,
    HtmlElementProps,
} from "decorator-shared/types";
import { clientEnv, env } from "../env/server";
import type { Manifest as ViteManifest } from "vite";
import { Params } from "decorator-shared/params";
import { texts } from "../texts";
import { buildCdnUrl } from "../urls";

const ENTRY_POINT_PATH = "src/main.ts";

const hotjarScript = `(function(h,o,t,j,a,r){
h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
h._hjSettings={hjid:118350,hjsv:6};
a=o.getElementsByTagName('head')[0];
r=o.createElement('script');r.async=1;
r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`;

const getScriptsProps = async (): Promise<HtmlElementProps[]> => {
    if (env.NODE_ENV === "development") {
        return [
            {
                tag: "script",
                attribs: {
                    src: "http://localhost:5173/@vite/client",
                    type: "module",
                },
            },
            {
                tag: "script",
                attribs: {
                    src: `http://localhost:5173/${ENTRY_POINT_PATH}`,
                    type: "module",
                },
            },
        ];
    }

    const manifest = (await import("decorator-client/dist/.vite/manifest.json"))
        .default as ViteManifest;

    const appScripts: HtmlElementProps[] = Object.values(manifest)
        .filter((item) => item.file.endsWith(".js"))
        .map((item) => ({
            tag: "script",
            attribs: {
                src: buildCdnUrl(item.file),
                type: "module",
                // Load everything except the entry file async
                ...(!item.isEntry && { async: "true", fetchpriority: "low" }),
            },
        }));

    return [
        ...appScripts,
        {
            tag: "script",
            attribs: {
                src: "https://in2.taskanalytics.com/tm.js",
                type: "module",
                async: "true",
                fetchpriority: "low",
            },
        },
        {
            tag: "script",
            body: hotjarScript,
            attribs: {
                type: "module",
                async: "true",
                fetchpriority: "low",
            },
        },
    ];
};

export const scriptsProps = await getScriptsProps();

const scripts = unsafeHtml(scriptsProps.map(buildHtmlElementString).join(""));

type DecoratorDataProps = {
    features: Features;
    params: Params;
};

export const buildDecoratorData = ({ features, params }: DecoratorDataProps) =>
    json({
        texts: Object.entries(texts[params.language])
            .filter(([key]) =>
                clientTextsKeys.includes(key as keyof ClientTexts),
            )
            .reduce(
                (prev, [key, value]) => ({
                    ...prev,
                    [key]: value,
                }),
                {},
            ),
        params,
        features,
        env: clientEnv,
    });

export const ScriptsTemplate = (props: DecoratorDataProps): Template => {
    return html`
        <script type="application/json" id="__DECORATOR_DATA__">
            ${buildDecoratorData(props)}
        </script>
        <script>
            window.__DECORATOR_DATA__ = JSON.parse(
                document.getElementById("__DECORATOR_DATA__")?.innerHTML ?? "",
            );
        </script>
        ${scripts}
    `;
};
