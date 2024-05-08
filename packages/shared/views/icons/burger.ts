import html from "decorator-shared/html";
import cls from "decorator-client/src/styles/burger.module.css";

export const BurgerIcon = () =>
    html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        focusable="false"
        aria-hidden="true"
        role="img"
        class="${cls.menuBurger}"
    >
        <path class="${cls.menuBurger__line_1}" d="M2 4h20"></path>
        <path class="${cls.menuBurger__line_2}" d="M2 12h20"></path>
        <path class="${cls.menuBurger__line_3}" d="M2 20h20"></path>
    </svg>`;
