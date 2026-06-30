import { describe, expect, it, vi } from "vitest";
import cls from "decorator-client/src/styles/search-form.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { searchFormHook } from "decorator-shared/views/search-form";
import { SearchForm } from "./search-form";

describe("SearchForm", () => {
    it("renders the search form SSR contract", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.123);

        const output = SearchForm().render({ language: "nb" });

        expect(output).toContain("<form");
        expect(output).toContain(`class="${cls.searchForm}"`);
        expect(output).toContain(`data-hydrate="${searchFormHook.form}"`);
        expect(output).toContain(
            `<label class="${cls.label}" for="search-0.123">Søk på nav.no</label>`,
        );
        expect(output).toContain(
            `<search-input class="${cls.searchWrapperInner}">`,
        );
        expect(output).toContain(`class="${cls.searchInput}"`);
        expect(output).toContain(`data-hydrate="${searchFormHook.input}"`);
        expect(output).toContain('name="search"');
        expect(output).toContain('maxlength="100"');
        expect(output).toContain('id="search-0.123"');
        expect(output).toContain(`class="${cls.clear} ${utils.hidden}"`);
        expect(output).toContain(`data-hydrate="${searchFormHook.clear}"`);
        expect(output).toContain('aria-label="Tøm"');
        expect(output).toContain(`class="${cls.submit}"`);
        expect(output).toContain('aria-label="Søk"');
    });
});
