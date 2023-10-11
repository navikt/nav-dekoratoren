import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';

import { ContextLink } from '../../context';
import { Template } from '../../html';

export function HeaderContextLenke({
  link,
  text,
  classNameOverride,
  containerClassName,
  attrs,
}: {
  link: ContextLink;
  text: Template;
  classNameOverride?: string;
  containerClassName?: string;
  attrs?: [string, string][];
}) {
  return LenkeMedSporing({
    href: link.url,
    children: text,
    classNameOverride: classNameOverride,
    containerClassName: containerClassName,
    attachContext: true,
    analyticsEventArgs: {
      action: 'arbeidsflate-valg',
      category: 'dekorator-header',
      label: link.context,
    },
    extraAttrs: attrs,
    defaultStyle: false,
  });
}
