import { expect, test } from "bun:test";
import { makeFrontpageUrl } from "lib/urls";

test("Frontpage URLs", () => {
    const baseUrl = "https://www.nav.no";
    expect(
        makeFrontpageUrl({ language: "en", context: "privatperson", baseUrl }),
    ).toBe("https://www.nav.no/en/home");
    expect(
        makeFrontpageUrl({ language: "nb", context: "privatperson", baseUrl }),
    ).toBe("https://www.nav.no/");
    expect(
        makeFrontpageUrl({ language: "nb", context: "arbeidsgiver", baseUrl }),
    ).toBe("https://www.nav.no/arbeidsgiver");
    expect(
        makeFrontpageUrl({
            language: "nb",
            context: "samarbeidspartner",
            baseUrl,
        }),
    ).toBe("https://www.nav.no/samarbeidspartner");
});
