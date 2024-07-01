import "./login-button";
import { fixture } from "@open-wc/testing";
import { vi } from "vitest";

it("makes the right login URL", async () => {
    window.__DECORATOR_DATA__ = {
        env: { LOGIN_URL: "https://login.ekstern.dev.nav.no" },
        params: { level: "Level4" },
    } as any;

    vi.stubGlobal("location", { href: "https://www.nav.no" });

    const el = (await fixture(`<login-button></login-button>`)) as HTMLElement;

    el.click();

    expect(window.location.href).to.equal(
        "https://login.ekstern.dev.nav.no?redirect=https://www.nav.no&level=Level4",
    );
});

afterEach(() => {
    vi.unstubAllGlobals();
});
