import { texts } from "decorator-server/src/texts";
import { updateDecoratorParams } from "../params";
import "./breadcrumbs";

describe("d-breadcrumbs", () => {
    beforeEach(() => {
        window.__DECORATOR_DATA__ = {
            params: {
                language: "nb",
                breadcrumbs: [
                    {
                        title: "Initial",
                        url: "https://www.nav.no/initial",
                    },
                ],
            },
            features: {},
            env: {
                XP_BASE_URL: "https://www.nav.no",
            },
            texts: texts.nb,
        } as any;

        document.body.innerHTML = "";
    });

    it("keeps server-rendered markup on connect", () => {
        const element = document.createElement("d-breadcrumbs");
        element.innerHTML = '<nav data-ssr="true">SSR breadcrumbs</nav>';

        document.body.appendChild(element);

        expect(element.innerHTML).toBe(
            '<nav data-ssr="true">SSR breadcrumbs</nav>',
        );
    });

    it("updates markup when breadcrumbs params change", () => {
        const element = document.createElement("d-breadcrumbs");
        element.innerHTML = '<nav data-ssr="true">SSR breadcrumbs</nav>';
        document.body.appendChild(element);

        updateDecoratorParams({
            breadcrumbs: [
                {
                    title: "Updated",
                    url: "https://www.nav.no/updated",
                },
            ],
        });

        expect(element.textContent).toContain("Updated");
        expect(element.innerHTML).not.toContain("data-ssr");
    });

    it("renders breadcrumbs when initial server markup is empty", () => {
        window.__DECORATOR_DATA__.params.breadcrumbs = [];
        const element = document.createElement("d-breadcrumbs");
        document.body.appendChild(element);

        expect(element.innerHTML).toBe("");

        updateDecoratorParams({
            breadcrumbs: [
                {
                    title: "Later",
                    url: "https://www.nav.no/later",
                },
            ],
        });

        expect(element.textContent).toContain("Later");
    });
});
