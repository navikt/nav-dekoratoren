import clsx from "clsx";
import html from "../../html";
import cls from "decorator-client/src/styles/button.module.css";

export type ButtonProps = {
    text: string;
    variant: "primary" | "secondary" | "outline" | "ghost";
    bigLabel?: boolean;
    wide?: boolean;
    className?: string;
    id?: string;
    data?: Record<string, string>;
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
