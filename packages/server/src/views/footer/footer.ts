import html from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { Features, Link, LinkGroup } from "decorator-shared/types";
import { Feedback } from "../feedback";
import { LogoutWarning } from "../logout-warning";
import { getModal } from "../screensharing-modal";
import { ComplexFooter } from "./complex-footer";
import { SimpleFooter } from "./simple-footer";

type FooterProps = {
    params: Params;
    features: Features;
    contactUrl: string;
} & (
    | {
          simple: true;
          links: Link[];
      }
    | {
          simple: false;
          links: LinkGroup[];
      }
);

export const Footer = ({
    simple,
    links,
    params,
    features,
    contactUrl,
}: FooterProps) => html`
    ${getModal({
        enabled: params.shareScreen && features["dekoratoren.skjermdeling"],
    })}
    <d-chatbot></d-chatbot>
    ${LogoutWarning()} ${params.feedback ? Feedback({ contactUrl }) : undefined}
    ${simple
        ? SimpleFooter({
              links,
              features,
          })
        : ComplexFooter({
              links,
              features,
          })}
`;
