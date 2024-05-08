import html from "../../html";

export function WarningIcon() {
    return html`
        <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            focusable="false"
            aria-hidden="true"
            role="img"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 0a1 1 0 01.894.553l11 22A1 1 0 0123 24H1a1 1 0 01-.894-1.447l11-22A1 1 0 0112 0zm-1 15V8h2v7h-2zm2.5 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                fill="currentColor"
            ></path>
        </svg>
    `;
}
