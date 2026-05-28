import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
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
    <div
        class="${clsx(aksel["aksel-alert"], aksel[`aksel-alert--${variant}`])}"
    >
        ${variant === "info"
            ? InformationSquareFillIcon({
                  className: aksel["aksel-alert__icon"],
                  ariaLabel: i18n("info"),
              })
            : XMarkOctagonFillIcon({
                  className: aksel["aksel-alert__icon"],
                  ariaLabel: i18n("error"),
              })}
        <span class="${aksel["aksel-body-long"]}">${content}</span>
    </div>
`;
