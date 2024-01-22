import { texts } from './texts';
import { cdnUrl, entryPointPath, getManifest } from './views';
import { DecoratorData } from './views/decorator-data';
import { clientEnv, env } from './env/server';
import { GetFeatures } from './unleash-service';
import { Params } from 'decorator-shared/params';

export default async ({ unleashService, data }: { unleashService: GetFeatures; data: Params }) => {
    const { language } = data;
    const localTexts = texts[language];

    const features = unleashService.getFeatures();

    const { links, scripts } = await getEnvAssetsRaw();

    return {
        language: data.language,
        scripts: scripts,
        styles: links,
        inlineScripts: [
            DecoratorData({
                texts: localTexts,
                params: data,
                features,
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
    links: string[];
    scripts: string[];
}> => {
    const manifest = await getManifest();

    const css = {
        production: manifest[entryPointPath].css.map(cdnUrl),
        development: '',
    };

    const scripts = {
        production: [cdnUrl(manifest[entryPointPath].file)],
        development: ['http://localhost:5173/@vite/client', `http://localhost:5173/${entryPointPath}`],
    };

    return {
        links: css[env.NODE_ENV] as string[],
        scripts: scripts[env.NODE_ENV],
    };
};
