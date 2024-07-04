import clsx from "clsx";
import cls from "decorator-client/src/styles/aksel.module.css";
import html, {
    AttributeValue,
    Template,
    htmlAttributes,
} from "decorator-shared/html";

export type ButtonProps = {
    content: Template;
    icon?: Template;
    variant: "primary" | "secondary" | "tertiary";
    type?: "button" | "submit" | "reset";
    className?: string;
    attributes?: Record<string, AttributeValue>;
    href?: string;
};

export const Button = ({
    content,
    icon,
    variant,
    type = "button",
    className,
    attributes = {},
    href,
}: ButtonProps) => html`
    <${href ? "a" : "button"}
        ${htmlAttributes(attributes)}
        ${href ? `href=${href}` : `type="${type}"`}
        class="${clsx(
            cls["navds-button"],
            {
                [cls["navds-button--primary"]]: variant === "primary",
                [cls["navds-button--secondary"]]: variant === "secondary",
                [cls["navds-button--tertiary"]]: variant === "tertiary",
            },
            className,
        )}"
    >
        ${
            icon &&
            html`<span class="${cls["navds-button__icon"]}">${icon}</span>`
        }
        <span class="${cls["navds-label"]}">${content}</span>
    </${href ? "a" : "button"}>
`;
