import { CustomEvents } from "../events";
import { param } from "../params";
import cls from "../styles/decorator-utils.module.css";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";

class DecoratorUtils extends HTMLElement {
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
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
        this.update();
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }

    handleParamsUpdated = (
        event: CustomEvent<CustomEvents["paramsupdated"]>,
    ) => {
        const { availableLanguages, breadcrumbs, utilsBackground } =
            event.detail.params;
        if (availableLanguages || breadcrumbs || utilsBackground) {
            this.update();
        }
    };
}

defineCustomElement("decorator-utils", DecoratorUtils);
