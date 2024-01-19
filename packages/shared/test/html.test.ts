import { describe, expect, it } from 'bun:test';
import html from '../html';

describe('html template tag', () => {
    it('escapes HTML variables to avoid XSS', () => {
        const maliciousInput = '<script>alert("XSS attack!");</script>';
        const output = html`<p>${maliciousInput}</p>`.render();
        expect(output).toEqual('<p>&lt;script&gt;alert(&quot;XSS attack!&quot;);&lt;/script&gt;</p>');
    });

    it('escapes HTML variables to avoid XSS in arrays', () => {
        const maliciousInput = '<script>alert("XSS attack!");</script>';
        const output = html`<p>${[maliciousInput]}</p>`.render();
        expect(output).toEqual('<p>&lt;script&gt;alert(&quot;XSS attack!&quot;);&lt;/script&gt;</p>');
    });

    it('does not escape nested html', () => {
        const output = html`${html`<script>
            alert('not an XSS attack!');
        </script>`}`.render();

        expect(output).toEqual(`<script>
      alert('not an XSS attack!');
    </script>`);
    });
});
