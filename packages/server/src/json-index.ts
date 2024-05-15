import { Params } from "decorator-shared/params";
import { clientEnv, env } from "./env/server";
import { texts } from "./texts";
import { getFeatures } from "./unleash";
import { cdnUrl, entryPointPath, getManifest } from "./views";
import { DecoratorData } from "./views/decorator-data";

export default async ({ data }: { data: Params }) => {
    const { language } = data;

    const { styles, scripts } = await getEnvAssetsRaw();

    return {
        language,
        scripts,
        styles,
        inlineScripts: [
            DecoratorData({
                texts: texts[language],
                params: data,
                features: getFeatures(),
                environment: clientEnv,
            }).render(),
            `<script>
        window.__DECORATOR_DATA__ = JSON.parse(
          document.getElementById('__DECORATOR_DATA__')?.innerHTML ?? '',
        );
      </script>`,
        ],
    };
};

const getEnvAssetsRaw = async (): Promise<{
    styles: string[];
    scripts: string[];
}> => {
    const manifest = await getManifest();

    if (env.NODE_ENV === "development") {
        return {
            styles: [],
            scripts: [
                "http://localhost:5173/@vite/client",
                `http://localhost:5173/${entryPointPath}`,
            ],
        };
    }
    return {
        styles: manifest[entryPointPath].css.map(cdnUrl),
        scripts: [cdnUrl(manifest[entryPointPath].file)],
    };
};
