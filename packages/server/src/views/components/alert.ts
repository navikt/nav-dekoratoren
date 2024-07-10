import clsx from "clsx";
import cls from "decorator-client/src/styles/alert.module.css";
import html, { Template } from "decorator-shared/html";
import {
    InformationSquareFillIcon,
    XMarkOctagonFillIcon,
} from "decorator-icons";
import i18n from "../../i18n";

export type AlertProps = {
    content: Template;
    variant: "error" | "info";
};

export const Alert = ({ variant, content }: AlertProps) => html`
    <div class="${clsx(cls["navds-alert"], cls[`navds-alert--${variant}`])}">
        ${variant === "info"
            ? InformationSquareFillIcon({
                  className: cls["navds-alert__icon"],
                  ariaLabel: i18n("info"),
              })
            : XMarkOctagonFillIcon({
                  className: cls["navds-alert__icon"],
                  ariaLabel: i18n("error"),
              })}
        <span class="${cls.text}">${content}</span>
    </div>
`;
