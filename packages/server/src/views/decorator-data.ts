import html, { json } from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { Features, clientTextsKeys } from "decorator-shared/types";
import { texts } from "../texts";
import { clientEnv } from "../env/server";

type DecoratorDataProps = {
    params: Params;
    features: Features;
};

export const DecoratorData = ({ params, features }: DecoratorDataProps) => html`
    <script type="application/json" id="__DECORATOR_DATA__">
        ${json({
            texts: Object.entries(texts[params.language])
                .filter(([key]) => clientTextsKeys.includes(key as any))
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
        })}
    </script>
`;
