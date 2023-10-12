import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing/lenke-med-sporing-helpers';
import html from 'decorator-shared/html';
import { Link } from 'decorator-shared/types';

export function FooterLenke({
  link,
  classNameOverride,
}: {
  link: Link;
  classNameOverride?: string;
}) {
  const { content, url } = link;

  return LenkeMedSporing({
    href: url,
    children: html`${content}`,
    classNameOverride,
    analyticsEventArgs: {
      category: 'dekorator-footer',
      action: `kontakt/${url}`,
      label: url,
    },
  });
}
