import clsx from "clsx";
import cls from "decorator-client/src/styles/aksel.module.css";
import html, {
    AttributeValue,
    Template,
    htmlAttributes,
} from "decorator-shared/html";

export type ButtonProps = {
    content: Template;
    variant: "primary" | "secondary" | "tertiary";
    type?: "button" | "submit" | "reset";
    attributes?: Record<string, AttributeValue>;
};

export const Button = ({
    content,
    variant,
    type = "button",
    attributes = {},
}: ButtonProps) => html`
    <button
        ${htmlAttributes(attributes)}
        type="${type}"
        class="${clsx(
            cls["navds-button"],
            cls["navds-label"],
            {
                [cls["navds-button--primary"]]: variant === "primary",
                [cls["navds-button--secondary"]]: variant === "secondary",
                [cls["navds-button--tertiary"]]: variant === "tertiary",
            },
            attributes.className,
        )}"
    >
        ${content}
    </button>
`;
