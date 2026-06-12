import { describe, expect, it } from "vitest";
import html, { json } from "../html";

describe("html template tag", () => {
    it("escapes HTML variables to avoid XSS", () => {
        const maliciousInput = '<script>alert("XSS attack!");</script>';
        const output = html`<p>${maliciousInput}</p>`.render({
            language: "nb",
        });
        expect(output).toEqual(
            "<p>&lt;script&gt;alert(&quot;XSS attack!&quot;);&lt;/script&gt;</p>",
        );
    });

    it("escapes HTML variables to avoid XSS in arrays", () => {
        const maliciousInput = '<script>alert("XSS attack!");</script>';
        const output = html`<p>${maliciousInput}</p>`.render({
            language: "nb",
        });
        expect(output).toEqual(
            "<p>&lt;script&gt;alert(&quot;XSS attack!&quot;);&lt;/script&gt;</p>",
        );
    });

    it("does not escape nested html", () => {
        // prettier-ignore
        const output = html`${html`<script>alert('not an XSS attack!');</script>`}`;

        expect(output.render({ language: "nb" })).toEqual(
            `<script>alert('not an XSS attack!');</script>`,
        );
    });
});

describe("json", () => {
    it("escapes </script> to prevent breaking out of script tags (reflected XSS)", () => {
        const maliciousPageTitle =
            "</script><script>alert(document.domain)</script>";
        const output = json({ pageTitle: maliciousPageTitle }).render({
            language: "nb",
        });

        expect(output).not.toContain("</script>");
        expect(output).not.toContain("<script>");
        expect(output).toContain("\\u003c/script\\u003e");
        expect(output).toContain("\\u003cscript\\u003e");
    });

    it("escapes < and > in JSON values", () => {
        const output = json({ value: "<b>test</b>" }).render({
            language: "nb",
        });

        expect(output).toContain("\\u003cb\\u003etest\\u003c/b\\u003e");
        expect(output).not.toContain("<b>");
    });

    it("escapes & in JSON values", () => {
        const output = json({ value: "foo & bar" }).render({ language: "nb" });

        expect(output).toContain("\\u0026");
        expect(output).not.toContain(" & ");
    });

    it("escapes Unicode line separators (\\u2028 and \\u2029) to prevent JS string literal breakage", () => {
        const output = json({ value: "line\u2028break\u2029end" }).render({
            language: "nb",
        });

        expect(output).not.toContain("\u2028");
        expect(output).not.toContain("\u2029");
        expect(output).toContain("\\u2028");
        expect(output).toContain("\\u2029");
    });

    it("produces valid JSON after escaping", () => {
        const data = {
            pageTitle: "</script><script>alert(1)</script>",
            count: 42,
        };
        const output = json(data).render({ language: "nb" });

        expect(() => JSON.parse(output)).not.toThrow();
        const parsed = JSON.parse(output);
        expect(parsed.pageTitle).toEqual(data.pageTitle);
        expect(parsed.count).toEqual(42);
    });
});
