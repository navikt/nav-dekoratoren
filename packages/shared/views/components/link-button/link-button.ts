import html from "../../../html";
import classes from "./link-button.module.css";

type LinkButtonProps = {
    text: string;
    className?: string;
    attrs?: string;
};

export function LinkButton({ text, className, attrs }: LinkButtonProps) {
    return html`
        <button class="${classes.linkButton} ${className}" ${attrs}>
            <span class="${classes.text}"> ${text} </span>
        </button>
    `;
}
