import { CsrPayload } from "decorator-shared/types";

const findOrError = (id: string) => {
    const el = document.getElementById(`decorator-${id}`);

    if (!el) {
        throw new Error(`No elem:${id}. See github.com/navikt/decorator-next`);
    }

    return el;
};

const hydrate = () =>
    fetch(findOrError("env").dataset.src!)
        .then((res) => res.json())
        .then((elements: CsrPayload) => {
            (["header", "footer"] as const).forEach(
                (key) => (findOrError(key).outerHTML = elements[key]),
            );
            window.__DECORATOR_DATA__ = elements.data;

            document.body.insertAdjacentHTML("beforeend", elements.scripts);
        });

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
} else {
    hydrate();
}
