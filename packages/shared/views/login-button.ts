import html, { Template } from "decorator-shared/html";
import { IconButton } from "./icon-button";
import { LoginIcon } from "decorator-shared/views/icons";

export function LoginButton(text: Template) {
    return html`
        <login-button>
            ${IconButton({
                id: "login-button",
                Icon: LoginIcon({}),
                text,
            })}
        </login-button>
    `;
}
