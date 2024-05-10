import html from "decorator-shared/html";
import { IconButton } from "./icon-button";
import { LoginIcon } from "decorator-shared/views/icons";
import { ClientTexts } from "decorator-shared/types";

export function LoginButton({ login }: ClientTexts) {
    return html`
        <login-button>
            ${IconButton({
                id: "login-button",
                Icon: LoginIcon({}),
                text: login,
            })}
        </login-button>
    `;
}
