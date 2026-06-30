import type { ClientParams } from "decorator-shared/params";
import type { CustomEvents } from "../events";

type ParamsUpdatedOptions<TKey extends keyof ClientParams> = {
    keys?: readonly TKey[];
    initial?: boolean;
    update: (
        params: ClientParams,
        changedKeys: ReadonlyArray<keyof ClientParams>,
    ) => void;
};

export const onParamsUpdated = <
    TKey extends keyof ClientParams = keyof ClientParams,
>({
    keys,
    initial = false,
    update,
}: ParamsUpdatedOptions<TKey>) => {
    const keysToWatch = keys as ReadonlyArray<keyof ClientParams> | undefined;
    const shouldHandle = (changedKeys: ReadonlyArray<keyof ClientParams>) =>
        !keysToWatch || changedKeys.some((key) => keysToWatch.includes(key));

    const listener = (event: Event) => {
        const { params, changedKeys } = (
            event as CustomEvent<CustomEvents["paramsupdated"]>
        ).detail;

        if (shouldHandle(changedKeys)) {
            update(params, changedKeys);
        }
    };

    window.addEventListener("paramsupdated", listener);

    if (initial) {
        update(window.__DECORATOR_DATA__.params, keysToWatch ?? []);
    }

    return () => window.removeEventListener("paramsupdated", listener);
};
