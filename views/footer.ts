import { html } from "common-tags";

import { SimpleFooter } from "./simple-footer";
import { ComplexFooter } from "./complex-footer";


export const Footer = () => html`
{{#simple}}
${SimpleFooter()}
{{/simple}}
{{^simple}}
${ComplexFooter()}
{{/simple}}
`;
// <!-- {{> complex-footer}} -->
