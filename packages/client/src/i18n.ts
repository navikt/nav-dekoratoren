import { Template } from "decorator-shared/html";
import { ClientTexts } from "decorator-shared/types";

export default (key: keyof ClientTexts): Template => ({
    render: () => window.__DECORATOR_DATA__.texts[key],
});
