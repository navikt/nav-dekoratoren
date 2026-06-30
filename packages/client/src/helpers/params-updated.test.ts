import { texts } from "decorator-server/src/texts";
import { updateDecoratorParams } from "../params";
import { onParamsUpdated } from "./params-updated";

describe("onParamsUpdated", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {
                language: "nb",
                context: "privatperson",
                breadcrumbs: [],
                availableLanguages: [],
            },
            features: {},
            env: {},
            texts: texts.nb,
        } as any;
    });

    it("does not call update initially by default", () => {
        const update = vi.fn();

        const unsubscribe = onParamsUpdated({
            keys: ["breadcrumbs"],
            update,
        });

        unsubscribe();
        expect(update).not.toHaveBeenCalled();
    });

    it("calls update initially when opted in", () => {
        const update = vi.fn();

        const unsubscribe = onParamsUpdated({
            keys: ["language"],
            initial: true,
            update,
        });

        unsubscribe();
        expect(update).toHaveBeenCalledWith(window.__DECORATOR_DATA__.params, [
            "language",
        ]);
    });

    it("updates when watched params change", () => {
        const update = vi.fn();

        const unsubscribe = onParamsUpdated({
            keys: ["language"],
            update,
        });

        updateDecoratorParams({ language: "en" });

        unsubscribe();
        expect(update).toHaveBeenCalledWith(window.__DECORATOR_DATA__.params, [
            "language",
        ]);
    });

    it("ignores unrelated params", () => {
        const update = vi.fn();

        const unsubscribe = onParamsUpdated({
            keys: ["breadcrumbs"],
            update,
        });

        updateDecoratorParams({ language: "en" });

        unsubscribe();
        expect(update).not.toHaveBeenCalled();
    });

    it("stops listening after unsubscribe", () => {
        const update = vi.fn();

        const unsubscribe = onParamsUpdated({
            keys: ["language"],
            update,
        });
        unsubscribe();

        updateDecoratorParams({ language: "en" });

        expect(update).not.toHaveBeenCalled();
    });
});
