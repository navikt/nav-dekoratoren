import { html } from '@/utils';

export function SearchShowMore({
  word,
  total,
}: {
  word: string;
  total: number;
}) {
  return html`
    <div>
      <div>Viser 5 av ${total.toString()} resultater.</div>
      <a
        href="https://www.nav.no/sok?ord=${word}"
        class="underline text-text-action"
        >Se alle treff ("${word}")</a
      >
    </div>
  `;
}
