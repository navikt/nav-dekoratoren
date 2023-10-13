import { LenkeMedSporing } from 'decorator-shared/views/lenke-med-sporing-helpers';
import { Link } from 'decorator-shared/types';

export function FooterLenke({
  link,
  className,
}: {
  link: Link;
  className?: string;
}) {
  const { content, url } = link;

  return LenkeMedSporing({
    href: url,
    children: content,
    className,
    analyticsEventArgs: {
      category: 'dekorator-footer',
      action: `kontakt/${url}`,
      label: url,
    },
  });
}
