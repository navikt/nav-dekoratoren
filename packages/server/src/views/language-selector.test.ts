import { describe, expect, it } from "vitest";
import type { AvailableLanguage } from "decorator-shared/params";
import { LanguageSelectorOption } from "decorator-shared/views/language-selector";
import cls from "decorator-client/src/styles/language-selector.module.css";
import { LanguageSelector } from "./language-selector";

const languages = [
    { locale: "nb", handleInApp: true },
    {
        locale: "en",
        handleInApp: false,
        url: "https://www.nav.no/en/person",
    },
] satisfies AvailableLanguage[];

describe("LanguageSelector", () => {
    it("renders handleInApp options as buttons", () => {
        const output = LanguageSelectorOption({
            language: languages[0],
            currentLanguage: "nb",
        }).render({ language: "nb" });

        expect(output).toContain("<button");
        expect(output).toContain('type="button"');
        expect(output).toContain(`class="${cls.option} ${cls.selected}"`);
        expect(output).toContain('data-locale="nb"');
        expect(output).toContain('aria-current="true"');
        expect(output).toContain("Norsk (bokmål)");
    });

    it("renders URL options as links", () => {
        const output = LanguageSelectorOption({
            language: languages[1],
            currentLanguage: "nb",
        }).render({ language: "nb" });

        expect(output).toContain("<a");
        expect(output).toContain('href="https://www.nav.no/en/person"');
        expect(output).toContain(`class="${cls.option}"`);
        expect(output).toContain('data-locale="en"');
        expect(output).toContain('aria-current="false"');
        expect(output).toContain("English");
    });

    it("keeps the server selector contract", () => {
        const output = LanguageSelector({
            availableLanguages: languages,
            language: "nb",
        }).render({ language: "nb" });

        expect(output).toContain("<language-selector>");
        expect(output).toContain('aria-controls="decorator-language-menu"');
        expect(output).toContain('id="decorator-language-menu"');
        expect(output).toContain('data-locale="nb"');
        expect(output).toContain('data-locale="en"');
    });
});
