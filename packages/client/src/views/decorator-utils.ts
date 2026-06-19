import { onParamsUpdated } from "../helpers/params-updated";
import { param } from "../params";
import cls from "../styles/decorator-utils.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";

class DecoratorUtils extends HTMLElement {
    private unsubscribeParams?: () => void;

    update = () => {
        this.classList.toggle(
            utils.hidden,
            param("availableLanguages").length === 0 &&
                param("breadcrumbs").length === 0,
        );

        const utilsBackground = param("utilsBackground");
        this.classList.toggle(cls.white, utilsBackground === "white");
        this.classList.toggle(cls.gray, utilsBackground === "gray");
    };

    connectedCallback() {
        this.unsubscribeParams = onParamsUpdated({
            keys: ["availableLanguages", "breadcrumbs", "utilsBackground"],
            initial: true,
            update: this.update,
        });
    }

    disconnectedCallback() {
        this.unsubscribeParams?.();
    }
}

defineCustomElement("decorator-utils", DecoratorUtils);
