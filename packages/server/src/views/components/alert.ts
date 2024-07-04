import clsx from "clsx";
import cls from "decorator-client/src/styles/alert.module.css";
import html, { Template } from "decorator-shared/html";

export type AlertProps = {
    content: Template;
    variant: "error" | "info";
};

export const Alert = ({ variant, content }: AlertProps) => html`
    <div class="${clsx(cls["navds-alert"], cls[`navds-alert--${variant}`])}">
        ${icons[variant]}
        <span class="${cls.text}">${content}</span>
    </div>
`;

const icons = {
    info: html`<svg
        class="${cls["navds-alert__icon"]}"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="img"
        aria-labelledby="title-R2d6"
        class="navds-alert__icon"
    >
        <title id="title-R2d6">Informasjon</title>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.25 4A.75.75 0 0 1 4 3.25h16a.75.75 0 0 1 .75.75v16a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75V4ZM11 7.75a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-1.25 3a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 .75.75v4.75h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75v-4h-.75a.75.75 0 0 1-.75-.75Z"
            fill="currentColor"
        ></path>
    </svg>`,

    error: html`
        <svg
            class="${cls["navds-alert__icon"]}"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
            aria-labelledby="title-R356"
            class="navds-alert__icon"
        >
            <title id="title-R356">Feil</title>
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.742 2.47a.75.75 0 0 1 .53-.22h7.456a.75.75 0 0 1 .53.22l5.272 5.272c.141.14.22.331.22.53v7.456a.75.75 0 0 1-.22.53l-5.272 5.272a.75.75 0 0 1-.53.22H8.272a.75.75 0 0 1-.53-.22L2.47 16.258a.75.75 0 0 1-.22-.53V8.272a.75.75 0 0 1 .22-.53L7.742 2.47Zm1.288 5.5a.75.75 0 0 0-1.06 1.06L10.94 12l-2.97 2.97a.75.75 0 1 0 1.06 1.06L12 13.06l2.97 2.97a.75.75 0 1 0 1.06-1.06L13.06 12l2.97-2.97a.75.75 0 0 0-1.06-1.06L12 10.94 9.03 7.97Z"
                fill="currentColor"
            ></path>
        </svg>
    `,
};
