import html, { json } from 'decorator-shared/html';
import { Environment, Params } from 'decorator-shared/params';
import { ClientTexts, Computed, Features, clientTextsKeys } from 'decorator-shared/types';

// @TODO: For after NITD. Features should be loaded on the client to avoid caching.
export const DecoratorData = ({
    texts,
    params,
    features,
    environment,
    computed
}: {
    texts: ClientTexts;
    params: Params;
    features: Features;
    environment: Environment;
        computed: Computed
}) => html`
    <script type="application/json" id="__DECORATOR_DATA__">
        ${json({
            texts: Object.entries(texts)
                .filter(([key]) => clientTextsKeys.includes(key as any))
                .reduce(
                    (prev, [key, value]) => ({
                        ...prev,
                        [key]: value,
                    }),
                    {}
                ),
            params,
            features,
            env: environment,
            computed
        })}
    </script>
`;
