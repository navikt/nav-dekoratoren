import { fixture } from "@open-wc/testing";
import "./local-time";

it("norwegian", async () => {
    window.__DECORATOR_DATA__ = {
        params: {
            language: "nb",
        },
    } as any;

    const el = await fixture(
        '<local-time datetime="2023-07-04T11:41:02.280367+02:00" />',
    );
    expect(el.innerHTML).to.equal("4. juli 2023 kl. 09:41");
});

it("english", async () => {
    window.__DECORATOR_DATA__ = {
        params: {
            language: "en",
        },
    } as any;

    const el = await fixture(
        '<local-time datetime="2023-07-04T11:41:02.280367+02:00" />',
    );
    expect(el.innerHTML).to.equal("July 4, 2023 at 09:41");
});
