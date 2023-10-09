import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';

import { ContextLink } from '../../context';
import { Context } from '../../params';

export function HeaderContextLenke({
  link,
  text,
  activeContext,
  classNameOverride,
  containerClassName,
  attrs,
}: {
  link: ContextLink;
  text: string;
  activeContext: Context;
  classNameOverride?: string;
  containerClassName?: string;
  attrs?: [string, string][];
}) {
  return LenkeMedSporing({
    href: link.url,
    children: text,
    classNameOverride: classNameOverride,
    containerClassName: containerClassName,
    analyticsEventArgs: {
      context: activeContext as Context,
      action: 'arbeidsflate-valg',
      category: 'dekorator-header',
      label: link.context,
    },
    extraAttrs: attrs,
    defaultStyle: false,
  });
}
