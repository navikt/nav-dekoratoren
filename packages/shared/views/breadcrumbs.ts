import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import { ChevronRightIcon, HouseIcon } from "decorator-icons";
import html, { Template, htmlAttributes } from "../html";
import { Breadcrumb } from "../params";
import { isNavUrl } from "../utils";
import cls from "./breadcrumbs.module.css";

export type BreadcrumbsProps = {
    breadcrumbs: Breadcrumb[];
    label: Template;
    frontPageUrl: string;
};

const validateBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
    breadcrumbs.forEach((breadcrumb) => {
        if (!breadcrumb.title) {
            const error = "breadcrumbs.title supports string";
            throw Error(error);
        }
        if (!breadcrumb.url) {
            const error = "breadcrumbs.url supports string";
            throw Error(error);
        }
        if (!isNavUrl(breadcrumb.url)) {
            const error = `breadcrumbs.url supports only nav.no urls - failed to validate ${breadcrumb.url}`;
            throw Error(error);
        }
    });
};

export const Breadcrumbs = ({
    breadcrumbs,
    label,
    frontPageUrl,
}: BreadcrumbsProps) => {
    validateBreadcrumbs(breadcrumbs);

    return breadcrumbs.length > 0
        ? html`
              <nav aria-label="${label}">
                  <ol class="${cls.list}">
                      <li class="${cls.listItem}">
                          <a
                              href="${frontPageUrl}"
                              class="${clsx(cls.homeLink, aksel["navds-link"])}"
                              data-analytics-title="nav.no"
                          >
                              ${HouseIcon({ className: cls.svg })} nav.no
                          </a>
                          ${ChevronRightIcon()}
                      </li>
                      ${breadcrumbs.map(
                          (
                              { title, url, handleInApp, analyticsTitle },
                              index,
                          ) => html`
                              <li class="${cls.listItem}">
                                  ${index === breadcrumbs.length - 1
                                      ? title
                                      : html`
                                            <a
                                                ${htmlAttributes({
                                                    className: clsx(
                                                        cls.link,
                                                        aksel["navds-link"],
                                                    ),
                                                    ["data-handle-in-app"]:
                                                        handleInApp ?? false,
                                                    ["data-analytics-title"]:
                                                        analyticsTitle,
                                                    href: url ?? "#",
                                                })}
                                                >${title}</a
                                            >
                                        `}
                                  ${index === breadcrumbs.length - 1
                                      ? ""
                                      : ChevronRightIcon()}
                              </li>
                          `,
                      )}
                  </ol>
              </nav>
          `
        : null;
};
