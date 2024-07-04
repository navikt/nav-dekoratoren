import { fetchAndRenderClientSide } from "./csr";

const hydrate = () => {
    const url = document.getElementById("decorator-env")?.dataset?.src;
    if (!url) {
        throw Error(
            `decorator-env for CSR not found - See github.com/navikt/decorator-next`,
        );
    }

    fetchAndRenderClientSide(url);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
} else {
    hydrate();
}
