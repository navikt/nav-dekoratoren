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
        class="${clsx(aksel["navds-alert"], aksel[`navds-alert--${variant}`])}"
    >
        ${variant === "info"
            ? InformationSquareFillIcon({
                  className: aksel["navds-alert__icon"],
                  ariaLabel: i18n("info"),
              })
            : XMarkOctagonFillIcon({
                  className: aksel["navds-alert__icon"],
                  ariaLabel: i18n("error"),
              })}
        <span class="${aksel["navds-body-long"]}">${content}</span>
    </div>
`;
