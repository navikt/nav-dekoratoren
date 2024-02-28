import { plugin } from 'bun';
import postcss from 'postcss';

export async function getPostcssTokens(path: string) {
    const val = await postcss([
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-modules')({
            getJSON: () => {
            },
            // Create stable classnames in dev mode, in order to not break in HMR when loaded via other apps
            ...(process.env.NODE_ENV === 'development' && {
                generateScopedName: '[name]__[local]',
            }),
        }),
    ]).process(await Bun.file(path).text(), { from: path });

    return val.messages.find(({ type, plugin }) => type === 'export' && plugin === 'postcss-modules')?.exportTokens;
}

plugin({
    name: 'css-modules',
    setup(build) {
        build.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
            return {
                exports: {
                    default: await getPostcssTokens(path),
                },
                loader: 'object',
            };
        });
    },
});
