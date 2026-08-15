# Site Override — "The Variance Report"

Authored art direction. **Overrides MASTER.md** where the two disagree.
MASTER.md proposed Brutalism + Cormorant/Montserrat + gold. Rejected: gold-on-black
is the default costume for "premium finance" and reads as template. Brutalism's
"raw/unpolished/default fonts" contradicts the credibility requirement for banking
and consulting recruiters. What is kept from MASTER: sharp corners (0 radius),
visible rules, asymmetric layout, high contrast, scroll-triggered chapter structure.

---

## 1. The concept

Every quantified line on the résumé is the same operation: **plan vs. actual**.
92% forecast accuracy. 8% budget-to-actual deviation across 6 business units.
9% deviation across 5 cost centres. 6% unit-cost reduction. 21% cycle compression.
₹4L of pricing gaps found in a 14-component BOM.

He is a person who finds the distance between what was planned and what happened,
names the driver, and closes it inside the cycle.

So the site is not a portfolio. It is **a variance report about a person** — set as a
financial broadsheet. Not a spreadsheet joke: the typography and grid are those of a
serious printed publication, and the data is his.

**The signature graphic:** the *variance rule* — a long hairline bar, mostly ink,
terminating in a vermillion segment. It is the site's recurring mark. It renders the
92/8 forecast split, the 91/9 cost-centre deviation, the 6% and 21% outcomes, and —
inverted and enormous — the competitive fields in §03.

**The audit stamp:** rotated, ruled boxes used *only* in §03 to mark his standing
inside a field. The report is not just written; it is stamped.

---

## 2. Grounds

The report **inverts** as it is read. Two grounds, hard cuts, never a fade between them.
Fixed chrome (top bar, left rail) adopts the current ground via `data-ground` on `<html>` —
the interface itself flips as the reader crosses a boundary.

| § | Section | Ground |
|---|---------|--------|
| 00 | Cover | ink |
| 01 | The Method | paper |
| 02 | The Ledger | paper |
| 03 | The Field | ink |
| 04 | Instruments | paper |
| 05 | Origin | ink |
| 06 | The Record | paper |
| 07 | Colophon | ink |

## 3. Colour

Warm bone paper and a cool near-black ink. One accent, used only as an annotation
mark — never as decoration, never as a fill for its own sake.

```
--paper        #F2EFE8   warm bone
--paper-sunk   #E7E2D7   recessed panels
--ink          #14161A   text on paper
--ink-soft     #3B4048
--ink-mute     #5F646C   5.19:1 on paper
--ink-bg       #101317   dark ground
--ink-bg-2     #171B20
--bone         #EFEBE2   text on ink        15.1:1
--bone-mute    #A8A69F   muted on ink        7.5:1
--verm         #D24B2A   graphic marks + large display  (3.8:1 — never small text on paper)
--verm-text    #B03A1E   small accent text on paper     5.3:1
--verm-ink     #E85C38   accent on ink ground           5.2:1
```

Rules are ink at 14–34% alpha — printed hairlines, not borders.

## 4. Type

Tri-stack. Every family has a job; none is decorative.

- **Bodoni Moda** (variable, `opsz` 6–96) — masthead, section displays, field numerals.
  Didone hairlines at large sizes only (≥40px). Below that it never appears — that is
  correct Didone practice, not a limitation.
- **Archivo** (variable 400–700) — decks, body, UI. A grotesque with more editorial
  spine than Inter; sits closer to broadsheet text than to product UI.
- **IBM Plex Mono** (400/500) — running heads, section numbers, tags, dates, and every
  aligned figure in the ledger. Guarantees tabular alignment in the statement columns.

Scale is fluid (`clamp`). Masthead `clamp(3.4rem, 14vw, 12.5rem)` at `line-height: .82`,
`letter-spacing: -.035em`. Micro labels 11px Plex Mono, `letter-spacing: .16em`, uppercase.

## 5. Grid, rules, depth

12-column editorial grid, asymmetric by default (content rarely starts at column 1 and
ends at column 12). Desktop carries a fixed left **rail** — the ledger margin — with
section ticks and scroll progress. Every section carries a sticky **running head**
(`§ number / title`), exactly as a printed report does. It is orientation and it is
on-concept.

Radius: **0** everywhere. Shadows: **none** — print has no shadows. Depth comes from
overlap, tone, and layering only.

Spacing scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.

## 6. Image treatment

One portrait, two appearances, never distorted or retouched:

1. **Cover** — a tall plate bled to the right and bottom edges, ≥960px. Desaturated and
   tone-mapped toward ink; a ledger grid of hairlines laid over the frame at 7% opacity;
   a soft left edge so the masthead *dissolves* under the plate rather than being
   guillotined mid-letter (image above type in z-order, so no text is ever compromised).
   A single vermillion rule crosses in front, tying the layers. Below 960px the plate
   becomes a full-bleed crop above the masthead — portrait-oriented (5:6, then 4:3 from
   600px), with the accent rule re-anchored to the bottom so it never crosses the face.
2. **Colophon (§07)** — a small square author photo, the way a magazine closes a feature.
   §05 was tried and cut: the portrait is a formal 2026 suit photograph and had no
   business illustrating a 2019 dance society. That section is stronger purely typographic.

No caption claims a place or date for the photograph — the résumé states neither.

Reveal: `clip-path` inset wipe upward on load. Scroll: 6% parallax drift inside its
frame, desktop only, disabled under reduced motion.

## 7. Motion

Restrained and purposeful. Two rules: motion carries hierarchy, and nothing moves twice.

- **Load choreography** (~1.1s): rules draw (`scaleX`), meta fades, masthead rises from a
  clip mask, portrait wipes, scroll cue last. Waits on `document.fonts.ready` (600ms cap)
  so the Didone never animates mid-swap.
- **Reveal**: `IntersectionObserver`, 18px rise + fade, 620ms, 60ms stagger.
- **Counters**: figures resolve from 0 to value on entry — the model recalculating.
  Tabular figures so nothing reflows.
- **Variance rules**: `scaleX` from origin-left, 1.1s, ink segment first, vermillion 180ms behind.
- **Hover/focus**: ledger rows shift 4px and raise a vermillion tick in the margin —
  an annotation, not a highlight.
- Easing: `cubic-bezier(.16,1,.3,1)` for entrances, `cubic-bezier(.4,0,.2,1)` for states.
- `prefers-reduced-motion`: all final states rendered immediately, counters set to value,
  parallax off, `scroll-behavior` auto.

## 8. Anti-patterns for this build

- No card grid of "experience cards".
- No skill percentage bars (unmeasurable, and it would cheapen the real variance bars).
- No derived statistics. `109 teams` and `6,300+ applicants` are different units — the
  site shows both figures at scale and never computes a percentile from them.
- No fabricated quote, testimonial, client, logo, or link.
- No gold, no glass, no gradient mesh, no particles.
