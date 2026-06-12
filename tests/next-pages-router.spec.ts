import { expect, type Page } from "@playwright/test";
import { nextPagesRouterUrl, testNextPagesRouter } from "./fixtures";

type DecoratorParamsSnapshot = Record<string, unknown>;

const getDecoratorParams = (page: Page) =>
    page.evaluate(() => {
        const decoratorWindow = window as Window & {
            __DECORATOR_DATA__: {
                params: DecoratorParamsSnapshot;
            };
        };

        return decoratorWindow.__DECORATOR_DATA__.params;
    });

const getSsrDecoratorParams = (html: string) => {
    const dataMatch = html.match(
        /<script type="application\/json" id="__DECORATOR_DATA__">\s*([\s\S]*?)\s*<\/script>/,
    );

    expect(dataMatch).not.toBeNull();

    return (
        JSON.parse(dataMatch![1].trim()) as {
            params: DecoratorParamsSnapshot;
        }
    ).params;
};

testNextPagesRouter(
    "sets route-derived params during SSR",
    async ({ page }) => {
        const response = await page.request.get(
            `${nextPagesRouterUrl}/arbeidsgiver?language=en`,
        );
        const params = getSsrDecoratorParams(await response.text());

        expect(params).toMatchObject({
            context: "arbeidsgiver",
            breadcrumbs: [],
            pageType: "arbeidsgiver",
        });
    },
);

testNextPagesRouter(
    "updates params from client navigation",
    async ({ page }) => {
        await page.getByRole("radio", { name: "Navigasjon" }).click();
        await page.getByLabel("Legg til parameter").selectOption("language");
        await page.getByRole("button", { name: "Legg til" }).click();
        await page.getByLabel("Legg til parameter").selectOption("context");
        await page.getByRole("button", { name: "Legg til" }).click();
        await page
            .getByLabel("Context", { exact: true })
            .selectOption("arbeidsgiver");
        await page
            .getByLabel("Rute", { exact: true })
            .selectOption("arbeidsgiver");
        await page
            .getByRole("button", { name: "Naviger med Next Link" })
            .click();

        await expect(page).toHaveURL(
            `${nextPagesRouterUrl}/arbeidsgiver?language=en&context=arbeidsgiver`,
        );
        await expect
            .poll(() => getDecoratorParams(page))
            .toMatchObject({
                context: "arbeidsgiver",
                language: "en",
                breadcrumbs: [],
            });
        await page.getByRole("radio", { name: "Navigasjon" }).click();
        await page.getByRole("radio", { name: "Navigasjon" }).click();
        await page.getByLabel("Legg til parameter").selectOption("simple");
        await page.getByRole("button", { name: "Legg til" }).click();
        await page.getByLabel("Enkel dekoratør", { exact: true }).check();
        await page.getByLabel("Rute", { exact: true }).selectOption("person");
        await page
            .getByRole("button", { name: "Naviger med router.replace" })
            .click();

        await expect(page).toHaveURL(
            `${nextPagesRouterUrl}/person?simple=true`,
        );
        await expect
            .poll(() => getDecoratorParams(page))
            .toMatchObject({
                context: "privatperson",
                language: "nb",
                simple: true,
            });
    },
);

testNextPagesRouter("updates and resets params directly", async ({ page }) => {
    await expect(
        page.getByRole("button", { name: "Fjern alle" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Fyll inn eksempel" }).click();
    await page.getByLabel("Legg til parameter").selectOption("pageType");
    await page.getByRole("button", { name: "Legg til" }).click();
    await page.getByLabel("Sidetype", { exact: true }).fill("direkte-test");
    await page.getByRole("button", { name: "Oppdater via moduler" }).click();

    await expect
        .poll(() => getDecoratorParams(page))
        .toMatchObject({
            context: "samarbeidspartner",
            language: "en",
            chatbotVisible: true,
            pageType: "direkte-test",
        });
    expect(await getDecoratorParams(page)).toMatchObject({
        breadcrumbs: expect.arrayContaining([
            expect.objectContaining({ title: "Sykepenger" }),
        ]),
    });

    await page.getByLabel("Språk", { exact: true }).selectOption("nb");
    await page
        .getByLabel("Brødsmuler", { exact: true })
        .selectOption("application");
    await page.getByLabel("Vis chatbot", { exact: true }).uncheck();
    await page
        .getByRole("button", { name: "Oppdater via window.postMessage" })
        .click();

    await expect
        .poll(() => getDecoratorParams(page))
        .toMatchObject({
            language: "nb",
            chatbotVisible: false,
            breadcrumbs: expect.arrayContaining([
                expect.objectContaining({ title: "Søknad om sykepenger" }),
            ]),
            pageType: "direkte-test",
        });

    await page.getByRole("button", { name: "Fjern alle" }).click();
    await page.getByRole("button", { name: "Oppdater via moduler" }).click();

    await expect
        .poll(() => getDecoratorParams(page))
        .toMatchObject({
            context: "privatperson",
            language: "nb",
            breadcrumbs: [],
            chatbotVisible: false,
            simple: false,
            simpleHeader: false,
            simpleFooter: false,
            utilsBackground: "transparent",
            pageType: "forside",
        });
    const resetParams = await getDecoratorParams(page);
    expect(resetParams.availableLanguages).toEqual([
        { locale: "nb", handleInApp: true },
        { locale: "en", handleInApp: true },
    ]);
    expect(resetParams).not.toMatchObject({
        pageType: "direkte-test",
        breadcrumbs: expect.arrayContaining([
            expect.objectContaining({ title: "Søknad om sykepenger" }),
        ]),
    });
});
