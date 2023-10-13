import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';

import { ContextLink } from '../../context';
import { Template } from '../../html';

export function HeaderContextLenke({
  link,
  text,
  className,
  dataContext,
}: {
  link: ContextLink;
  text: Template;
  className?: string;
  dataContext: string;
}) {
  return LenkeMedSporing({
    href: link.url,
    children: text,
    className,
    attachContext: true,
    analyticsEventArgs: {
      action: 'arbeidsflate-valg',
      category: 'dekorator-header',
      label: link.context,
    },
    dataContext,
  });
}
