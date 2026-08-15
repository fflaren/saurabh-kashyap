# The Variance Report — Saurabh Kashyap

A personal brand site built as a **financial variance report about a person**.

Every quantified line on the résumé is the same operation: plan vs. actual. 92% forecast
accuracy. 8% budget-to-actual deviation across six business units. 9% across five cost
centres. 6% unit-cost reduction. 21% cycle compression. So the site is not a portfolio —
it is a report, set as a broadsheet, and the data is his.

**The signature graphic** is the *variance rule*: a hairline bar, mostly ink, terminating
in a vermillion segment. It renders the 92/8 forecast split, the 91/9 cost-centre
deviation, and the 21% cycle compression — and, inverted and enormous, the competitive
fields in §03.

Full art direction: [`design-system/saurabh-kashyap/pages/site.md`](design-system/saurabh-kashyap/pages/site.md).

---

## Running it

No build step, no dependencies, no framework. Any static server works:

```bash
python3 serve.py 4173
```

Then open <http://localhost:4173>. Deploying = uploading the folder as-is
(GitHub Pages, Netlify, Vercel, Cloudflare Pages — all work with zero configuration).

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole document. Eight sections, semantic landmarks. |
| `styles.css` | Design system + layout. Tokens at the top, sections numbered 1–16. |
| `main.js` | ~190 lines, vanilla. Reveals, counters, ground inversion, rail, sheet. |
| `assets/` | Portrait at three widths (WebP + JPEG fallback) and the résumé PDF. |
| `serve.py` | Local dev server with caching disabled. |
| `design-system/` | Generated design system + the authored override that supersedes it. |

## Structure

The information architecture is ordered by **significance, not chronology**:

| § | Section | Ground | What it carries |
|---|---|---|---|
| 00 | Cover | ink | Masthead, portrait plate, three headline figures |
| 01 | The Method | paper | The through-line: decompose → isolate → close |
| 02 | The Ledger | paper | Both analyst engagements, as financial statements |
| 03 | The Field | ink | Competitive results drawn against their populations |
| 04 | Instruments | paper | Two toolkits (finance / media) + certifications |
| 05 | Origin | ink | Ethereal, 2019 — the first budget he ran |
| 06 | The Record | paper | Education, plainly stated |
| 07 | Colophon | ink | Contact, résumé, interests |

The report **inverts** between paper and ink grounds. The fixed chrome (top bar, left
rail) reads `data-ground` off `<html>` and flips with it, so the interface itself changes
as you cross a boundary.

## Editing content

All copy lives in `index.html` as plain markup — there is no CMS or data file.

- **Figures that animate** use `data-count="92"` with optional `data-suffix="+"`. The
  element's text content is the correct final value, so the page is right with JS off.
- **Variance rules** are `<figure class="delta" data-delta style="--v:92">` — `--v` is the
  ink portion; the vermillion remainder is computed as `100 - v`.
- **Section order** is driven by DOM order. Three places list the sections and must stay in
  sync: the `.rail` list, the `.sheet__list`, and the sections themselves.

## Things worth knowing

**Progressive enhancement.** Without JavaScript every section renders in its final,
readable state — reveals are gated on a `.js` class set inline in `<head>`, and counters
already contain their values in the markup.

**Accessibility.** Semantic landmarks and a clean `h1 → h2 → h3` outline. All text meets
WCAG AA (the accent has three tuned variants so small text never uses the 3.8:1 one). All
controls are ≥44px. Focus is visible everywhere, the contents sheet traps focus and
restores it on close, and `prefers-reduced-motion` renders every final state with no
motion at all.

**Performance.** Three self-contained files plus one image. The portrait ships as WebP
(43KB at full size vs 182KB JPEG) with a JPEG fallback and a matched `imagesrcset`
preload. Fonts are three variable families from Google Fonts with `display=swap`.

**Print.** `Cmd/Ctrl+P` produces a clean black-on-white document — chrome hidden, all
reveal states forced visible, decorative ghost numerals dropped.

## Two things to change before you publish

1. **Your email is on the page.** `saurabhkashyap2411@gmail.com` appears in §07 and will be
   scraped by bots once this is public. Swap it for a contact form or an alias if that
   matters to you.
2. **Add your LinkedIn.** There's no link to it because the résumé doesn't contain one, and
   nothing on this site was invented. Recruiters will look for it — add it next to the
   email button in §07.

Also worth a look: the colophon headline reads *"Available for finance, strategy &
consulting roles."* That's positioning copy, not a résumé fact — reword it to match
whatever you're actually recruiting for.

## Content integrity

Every figure, date, employer, credential and award on this site comes from the résumé PDF.
Nothing was invented to fill space. Where the résumé is silent, so is the site:

- No location is claimed anywhere — the résumé states none. §07 lists *institutions*.
- No caption gives a place or date for the photograph.
- "GEO" is listed exactly as written, with no expansion asserted.
- §03 shows `109 teams` and `6,300+ applicants` as separate figures and never computes a
  percentile from them — they are different units, and the division would be misleading.
- §06 gives IIM Shillong its own band rather than a table row, because the résumé names no
  degree or year for it; the table reproduces the three qualifications exactly as listed.
