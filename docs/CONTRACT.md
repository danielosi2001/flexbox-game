# Contract — Data model & DOM

Agreed in Step 0. **Neither side changes this file alone** — a change here is a PR
both people approve, because it breaks the other side's work.

Lane rule: **Person A never edits `js/`. Person B never edits `css/` or the markup
structure.** That is what keeps merges clean.

---

## 1. Level data model (`js/levels.js`)

```js
const LEVELS = [
  {
    id: 1,
    title: "עגינה בסיסית",
    instruction: "סדרו את כל התאים בשורה אחת, צמודים לקצה הימני של הלוח.",
    items: 3,                 // how many pods to render
    itemSizes: null,          // or ['sm','lg','sm'] — one entry per item
    controls: ['flex-direction', 'justify-content'],  // which selects to show
    solution: {
      'display': ['flex'],
      'flex-direction': ['row'],
      'justify-content': ['flex-end'],
    },
    hint: "flex-end דוחף לקצה בכיוון הראשי."
  },
  // ...
];
```

- `solution` values are **arrays** → more than one answer may be accepted.
- Any property **not** in `solution` is ignored when checking, so extra controls
  never block a pass.
- `controls` drives the UI: the selects are rendered from data, there is zero
  per-level HTML.

### Values the CSS is built to support

| control | values |
|---|---|
| `flex-direction` | `row`, `row-reverse`, `column`, `column-reverse` |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | `stretch`, `flex-start`, `flex-end`, `center`, `baseline` |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` |

Defaults after `reset()`: `row` / `flex-start` / `stretch` / `nowrap`.

---

## 2. DOM contract — fixed IDs

### Board direction — the page is RTL, the board is LTR

`index.html` is `<html lang="he" dir="rtl">` because the interface is Hebrew.
**`#board` deliberately overrides that with `dir="ltr"`.**

This is not cosmetic. Direction defines the flex main axis: in an RTL container
`flex-direction: row` runs right-to-left, so `justify-content: flex-end` moves
items to the **left** edge. Measured in a browser, an RTL row with `flex-end`
leaves a 1px gap on the left and 221px on the right — the mirror image of what
every Flexbox tutorial, and our own level 1 ("צמודים לקצה הימני"), describes.

With `dir="ltr"` on the board:

- with `flex-direction: row`, `flex-start` is the **left** edge and `flex-end` is the **right** edge;
- pod 1 sits leftmost, so `row-reverse` reads as a real reversal.

The instructions are written in Hebrew but describe the **LTR** picture the
student sees inside the bay, which is the same picture the assignment and the
MDN docs describe. Do not remove `dir="ltr"` from `#board`.


These IDs exist in `index.html` and **must not be renamed**.

| id | element |
|---|---|
| `#board` | the flex container (play area) |
| `#controls` | container the selects are rendered into |
| `#instruction` | level task text |
| `#level-indicator` | "שלב 3 מתוך 8" |
| `#msg` | success / error message box (`aria-live="polite"`) |
| `#btn-check` | check answer |
| `#btn-reset` | reset the board |
| `#btn-next` | next level |
| `#btn-prev` | previous level |
| `#level-map` | clickable list of completed levels |

### Screens

| id | element |
|---|---|
| `#screen-start` | start screen `<section>` |
| `#screen-game` | game screen `<section>` |
| `#screen-win` | win screen `<section>` |

Exactly one screen is visible at a time. Toggle with the **`.hidden`** class —
`.hidden { display: none !important; }` lives in `css/style.css`.

### Extra IDs (beyond the original table)

| id | element |
|---|---|
| `#btn-start` | start screen → game |
| `#btn-continue` | resume from `localStorage`; JS shows/hides it |
| `#btn-hint` | reveal `level.hint` (costs points) |
| `#hint` | where the hint text is written |
| `#final-score` | total score on the win screen |
| `#score-breakdown` | `<tbody>` for the per-level attempts/score rows |
| `#btn-replay` | play again — clears storage |

---

## 3. Classes JS must produce, CSS styles

`ui.js` renders pods into `#board`:

```html
<div class="pod" data-index="0"></div>
<div class="pod pod--sm"></div>   <!-- itemSizes 'sm' -->
<div class="pod pod--lg"></div>   <!-- itemSizes 'lg' -->
```

`.pod` is the default size. `itemSizes` entries map `'sm' → .pod--sm`,
`'lg' → .pod--lg`.

Each control renders as:

```html
<div class="control">
  <label class="control__label" for="ctl-justify-content">justify-content</label>
  <select class="control__select" id="ctl-justify-content" data-prop="justify-content">
    <option value="flex-start">flex-start</option>
  </select>
</div>
```

Select id = `ctl-` + property name. `data-prop` carries the CSS property.

Level map entries:

```html
<button class="level-chip is-solved" data-level="0">1</button>
```

State classes: `.is-solved`, `.is-current`, `.is-locked`.

---

## 4. State classes JS toggles (CSS owns the animation)

| class | on | effect |
|---|---|---|
| `.is-success` | `#board` | green flash, pods lock in |
| `.is-error` | `#board` | red shake |
| `#msg.msg--ok` / `.msg--err` | `#msg` | message colour |

JS adds the class and removes it after the animation; CSS never assumes it stays.

---

## 5. Board sizing — non-negotiable

`#board` is **always `480 × 320` px**, at every resolution. Small screens scale
the *wrapper* with `transform: scale(var(--board-scale))`, so the puzzle solution
is identical on desktop and mobile. This is an explicit assignment requirement —
do not swap it for a fluid width.

---

## 6. Script load order

`levels.js → engine.js → ui.js → main.js`, all `defer`, no modules and no
bundler, so GitHub Pages serves it with zero config.
