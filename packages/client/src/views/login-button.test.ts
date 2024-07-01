import "./login-button";
import { fixture } from "@open-wc/testing";
import { vi } from "vitest";

it("makes the right login URL with parameter", async () => {
    window.__DECORATOR_DATA__ = {
        env: { LOGIN_URL: "https://login.ekstern.dev.nav.no" },
        params: {
            level: "Level3",
            language: "en",
            redirectToUrl: "https://www.nav.no/foobar",
        },
    } as any;

    vi.stubGlobal("location", { href: "https://www.nav.no" });

    const el = (await fixture(`<login-button></login-button>`)) as HTMLElement;

    el.click();

    expect(window.location.href).to.equal(
        "https://login.ekstern.dev.nav.no?redirect=https://www.nav.no/foobar&level=Level3&locale=en",
    );
});

it("makes the right login with env", async () => {
    window.__DECORATOR_DATA__ = {
        env: {
            LOGIN_URL: "https://login.ekstern.dev.nav.no",
            MIN_SIDE_URL: "https://www.nav.no/minside",
        },
        params: {
            level: "Level4",
            language: "nb",
        },
    } as any;

    vi.stubGlobal("location", { href: "https://www.nav.no" });

    const el = (await fixture(`<login-button></login-button>`)) as HTMLElement;

    el.click();

    expect(window.location.href).to.equal(
        "https://login.ekstern.dev.nav.no?redirect=https://www.nav.no/minside&level=Level4&locale=nb",
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
});
