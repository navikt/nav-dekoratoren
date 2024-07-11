import { Params } from "decorator-shared/params";
import { Features } from "decorator-shared/types";
import {
    getComplexFooterLinks,
    getSimpleFooterLinks,
} from "../../menu/main-menu";
import { env } from "../../env/server";
import html, { Template } from "decorator-shared/html";
import { getModal } from "../screensharing-modal";
import { LogoutWarning } from "../logout-warning";
import { Feedback } from "../feedback";
import { SimpleFooter } from "./simple-footer";
import { ComplexFooter } from "./complex-footer";

const CONTACT_URL = `${env.XP_BASE_URL}/kontaktoss`;

type Props = {
    params: Params;
    features: Features;
    withContainers?: boolean;
};

export const Footer = async ({
    params,
    features,
    withContainers,
}: Props): Promise<Template> => {
    const { shareScreen, feedback, simple, simpleFooter, language, context } =
        params;

    const footerContent =
        simple || simpleFooter
            ? SimpleFooter({
                  links: await getSimpleFooterLinks({
                      language,
                  }),
                  features,
              })
            : ComplexFooter({
                  links: await getComplexFooterLinks({
                      language,
                      context,
                  }),
                  features,
              });

    const footer = html`
        ${getModal({
            enabled: shareScreen && features["dekoratoren.skjermdeling"],
        })}
        <d-chatbot></d-chatbot>
        ${LogoutWarning()}
        ${feedback ? Feedback({ contactUrl: CONTACT_URL }) : undefined}
        ${footerContent}
    `;

    return withContainers
        ? html`
              <div id="decorator-footer">
                  <decorator-footer>${footer}</decorator-footer>
              </div>
          `
        : footer;
};
