import html from "decorator-shared/html";

export function MessageIcon() {
    return html`<svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
        role="img"
    >
        <rect width="24" height="24" fill="#3380A5" rx="4" />
        <path
            fill="#fff"
            fill-rule="evenodd"
            d="M5.438 7.5c0-1.14.923-2.063 2.062-2.063h9c1.14 0 2.063.923 2.063 2.063v6.75c0 1.139-.924 2.062-2.063 2.062H9.906l-3.617 2.17A.563.563 0 0 1 5.438 18V7.5Z"
            clip-rule="evenodd"
        />
    </svg>`;
}

export function TaskIcon() {
    return html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
    >
        <rect width="24" height="24" fill="#C77300" rx="4" />
        <path
            fill="#fff"
            fill-rule="evenodd"
            d="M6.188 5.625c0-.518.42-.938.937-.938h9.75c.518 0 .938.42.938.938v12.75c0 .518-.42.938-.938.938h-9.75a.937.937 0 0 1-.938-.938V5.625ZM11.438 15c0-.31.251-.563.562-.563h2.625a.562.562 0 1 1 0 1.126H12a.562.562 0 0 1-.563-.563ZM12 11.437a.562.562 0 1 0 0 1.126h2.625a.562.562 0 1 0 0-1.126H12Zm-2.242 1.126H9.75a.562.562 0 1 1 0-1.126h.008a.562.562 0 1 1 0 1.126Zm0 1.874H9.75a.562.562 0 1 0 0 1.126h.008a.562.562 0 1 0 0-1.126Zm2.43-6.187c0-.31.251-.563.562-.563h1.875a.562.562 0 1 1 0 1.125H12.75a.562.562 0 0 1-.563-.562Zm-.863-.412a.563.563 0 0 0-.9-.675l-.736.98-.291-.29a.563.563 0 0 0-.796.795l.75.75a.563.563 0 0 0 .848-.06l1.125-1.5Z"
            clip-rule="evenodd"
        />
    </svg>`;
}
