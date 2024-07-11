/// <reference lib="DOM" />
import type { Preview } from "@storybook/html";
import "decorator-client/src/main.css";
import "decorator-client/src/views/breadcrumb";
import "decorator-client/src/views/user-menu";
import "decorator-client/src/views/dropdown-menu";
import "decorator-client/src/views/language-selector";
import "decorator-client/src/views/loader";
import "decorator-client/src/views/local-time";
import "decorator-client/src/views/menu-background";
import "decorator-client/src/views/search-input";
import html from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import {
    INITIAL_VIEWPORTS,
    MINIMAL_VIEWPORTS,
} from "@storybook/addon-viewport";
import { texts } from "../packages/server/src/texts";
import { ClientTexts } from "decorator-shared/types";
import { updateDecoratorParams } from "decorator-client/src/params";

declare global {
    interface Window {
        __DECORATOR_DATA__: {
            params: Partial<Params>;
            texts: ClientTexts;
        };
    }
}

document.documentElement.lang = "nb";

const customViewports = {
    ...MINIMAL_VIEWPORTS,
    mobile: INITIAL_VIEWPORTS.iphone12,
    ipad: INITIAL_VIEWPORTS.ipad,
};

window.__DECORATOR_DATA__ = {
    params: {
        language: "nb",
    },
    texts: texts["nb"],
};

const preview: Preview = {
    globalTypes: {
        locale: {
            name: "Locale",
            defaultValue: "nb",
            toolbar: {
                icon: "globe",
                items: [
                    { value: "nb", title: "Norsk" },
                    { value: "en", title: "English" },
                ],
            },
        },
    },
    decorators: [
        (Story, context) => {
            const story = Story();

            const language = context.globals.locale;

            window.__DECORATOR_DATA__.texts = texts[language];
            updateDecoratorParams({ language });

            if (story === null) {
                return "";
            } else if (typeof story === "object" && "render" in story) {
                return html`<div id="decorator-header">${story}</div>`.render({
                    language,
                });
            } else {
                const wrapper = document.createElement("div");
                wrapper.setAttribute("id", "decorator-header");
                // @ts-ignore
                wrapper.appendChild(story);
                return wrapper;
            }
        },
    ],
    parameters: {
        viewport: {
            viewports: customViewports,
            defaultViewport: "desktop",
        },
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
