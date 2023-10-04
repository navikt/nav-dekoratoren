import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';
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
    children: content,
    classNameOverride,
    analyticsEventArgs: {
      category: 'dekorator-footer',
      action: `kontakt/${url}`,
      label: url,
    },
  });
}
