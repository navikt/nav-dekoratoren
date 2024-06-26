import clsx from "clsx";
import cls from "decorator-client/src/styles/button.module.css";
import html, { Template } from "../../html";

export type ButtonProps = {
    text: Template | string;
    variant: "primary" | "secondary" | "outline" | "ghost";
    bigLabel?: boolean;
    wide?: boolean;
    className?: string;
    id?: string;
    data?: Record<string, Template | string>;
};

export const Button = ({
    text,
    variant,
    bigLabel,
    wide,
    className,
    id,
    data,
}: ButtonProps) => html`
    <button
        ${id ? html`id="${id}"` : ""}
        ${data
            ? Object.entries(data).map(
                  ([key, value]) => html`data-${key}="${value}"`,
              )
            : ""}
        class="${clsx(
            cls.button,
            {
                [cls.primary]: variant === "primary",
                [cls.secondary]: variant === "secondary",
                [cls.outline]: variant === "outline",
                [cls.ghost]: variant === "ghost",
                [cls.bigLabel]: bigLabel,
                [cls.wide]: wide,
            },
            className,
        )}"
    >
        ${text}
    </button>
`;
