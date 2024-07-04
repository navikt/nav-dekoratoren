import { fetchAndRenderClientSide } from "./csr";

const findOrError = (id: string) => {
    const el = document.getElementById(`decorator-${id}`);

    if (!el) {
        throw new Error(`No elem:${id}. See github.com/navikt/decorator-next`);
    }

    return el;
};

const hydrate = () => fetchAndRenderClientSide(findOrError("env").dataset.src!);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
} else {
    hydrate();
}
