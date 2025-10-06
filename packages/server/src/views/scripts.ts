import html, { json, Template, unsafeHtml } from "decorator-shared/html";
import { buildHtmlElementString } from "../lib/html-element-string-builder";
import { DecoratorDataProps, HtmlElementProps } from "decorator-shared/types";
import { env } from "../env/server";
import type { Manifest as ViteManifest } from "vite";
import { buildCdnUrl } from "../urls";
import { buildDecoratorData } from "../decorator-data";

const ENTRY_POINT_PATH = "src/main.ts";

const taskAnalyticsScript = `window.initConditionalTaskAnalytics = function () {
    var head = document.getElementsByTagName("head")[0];
    var taScript = document.createElement("script");
    taScript.async = true;
    taScript.src = "https://in2.taskanalytics.com/tm.js";
    head.appendChild(taScript);
};`;

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
                ...(item.isEntry
                    ? {} // Do not need defer here, as type: "module" automatically behaves like defer
                    : { async: "async" }),
            },
        }));

    const analyticsScripts = [
        {
            tag: "script",
            body: taskAnalyticsScript,
            attribs: {
                id: "d-task-analytics-container",
                type: "module",
                async: "async",
                fetchpriority: "low",
            },
        },
    ];

    return [...appScripts, ...analyticsScripts];
};

export const scriptsProps = await getScriptsProps();

const scriptsHtml = unsafeHtml(
    scriptsProps.map(buildHtmlElementString).join(""),
);

export const ScriptsTemplate = (props: DecoratorDataProps): Template => {
    return html`
        <script type="application/json" id="__DECORATOR_DATA__">
            ${json(buildDecoratorData(props))}
        </script>
        <script id="d-data-parser">
            window.__DECORATOR_DATA__ = JSON.parse(
                document.getElementById("__DECORATOR_DATA__")?.innerHTML ?? "",
            );
        </script>
        <script
            async="true"
            type="text/javascript"
            src="https://app-cdn.puzzel.com/public/js/pzl_loader.js"
            id="pzlModuleLoader"
            data-customer-id="41155"
        ></script>
        ${scriptsHtml}
    `;
};
