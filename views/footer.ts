import { html } from "../utils";


export const Footer = html`
{{#simple}}
{{> simple-footer}}
{{/simple}}
{{^simple}}
{{> complex-footer}}
{{/simple}}
`;
