import html from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { Features, Link, LinkGroup } from "decorator-shared/types";
import { Feedback } from "../feedback";
import { getModal } from "../screensharing-modal";
import { ComplexFooter } from "./complex-footer";
import { SimpleFooter } from "./simple-footer";
import { LogoutWarning } from "../logout-warning";

type FooterProps = {
    data: Params;
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
    data,
    features,
    contactUrl,
}: FooterProps) =>
    html`<div id="decorator-footer">
        ${getModal({
            enabled: data.shareScreen && features["dekoratoren.skjermdeling"],
        })}
        <d-chatbot></d-chatbot>
        ${LogoutWarning()}
        ${data.feedback ? Feedback({ contactUrl }) : undefined}
        ${simple
            ? SimpleFooter({
                  links,
                  features,
              })
            : ComplexFooter({
                  links,
                  features,
              })}
    </div>`;
