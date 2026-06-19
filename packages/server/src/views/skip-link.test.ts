import { describe, expect, it } from "vitest";
import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/skiplink.module.css";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
    it("renders the skip-link SSR contract", () => {
        const output = SkipLink(html`Hopp til innhold`).render({
            language: "nb",
        });

        expect(output).toContain("<skip-link>");
        expect(output).toContain('href="#maincontent"');
        expect(output).toContain(`class="${cls.skiplink}"`);
        expect(output).toContain("Hopp til innhold");
    });
});
