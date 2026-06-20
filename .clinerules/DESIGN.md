# Design

## Visual Concept

**Quiet morning study.** The feeling of sitting down with a notebook in calm early light — nothing between you and the thought. Generous white space, a single confident accent color, typography that rewards reading. The interface does not decorate; it makes room. Content is the only thing that matters on screen.

The app should look like a carefully made productivity tool, not a tutorial project. No default Bootstrap styling. No cream backgrounds. No gradient text. No glass cards. Just a clean, calm, focused writing surface.

## Color Palette

All colors in OKLCH. Strategy: **Restrained** — pure white surface, single indigo primary, teal accent for status and links.

```
/* Base surfaces */
--bg:                oklch(1.000 0.000 0);        /* Pure white — the writing surface */
--surface:            oklch(0.970 0.004 230);      /* Card/panel surface, barely tinted toward brand */
--surface-elevated:   oklch(0.985 0.002 230);      /* Elevated cards, dialogs */

/* Text */
--ink:                oklch(0.180 0.006 230);      /* Body text, near-black with whisper of blue */
--ink-secondary:      oklch(0.460 0.006 230);      /* Secondary text, captions, metadata */
--ink-tertiary:       oklch(0.670 0.004 230);      /* Placeholder, disabled, very subdued */
--ink-on-primary:     oklch(1.000 0.000 0);        /* White text on primary fills */
--ink-on-accent:      oklch(1.000 0.000 0);        /* White text on accent fills */

/* Brand */
--primary:            oklch(0.570 0.145 230);      /* Indigo — primary buttons, selected states */
--primary-hover:      oklch(0.520 0.155 230);      /* Darker hover */
--primary-active:     oklch(0.470 0.150 230);      /* Pressed state */
--primary-muted:      oklch(0.940 0.020 230);      /* Subtle primary tint for backgrounds, selections */

/* Accent */
--accent:             oklch(0.680 0.135 175);      /* Teal — links, badges, status indicators */
--accent-hover:       oklch(0.630 0.145 175);
--accent-muted:       oklch(0.940 0.025 175);      /* Subtle accent tint */

/* Semantic */
--success:            oklch(0.620 0.150 160);      /* Green */
--success-muted:      oklch(0.940 0.040 160);
--warning:            oklch(0.720 0.150 85);       /* Amber */
--warning-muted:      oklch(0.950 0.060 85);
--error:              oklch(0.520 0.180 25);       /* Red */
--error-muted:        oklch(0.940 0.040 25);

/* Borders & Dividers */
--border:             oklch(0.910 0.004 230);      /* Subtle borders between elements */
--border-strong:      oklch(0.850 0.006 230);      /* Stronger borders, input outlines */

/* Focus */
--ring:               oklch(0.570 0.145 230 / 50%);/* Focus ring, uses primary with alpha */

/* Shadows — minimal, purposeful, warm-neutral black */
--shadow-sm:          0 1px 2px oklch(0.180 0.006 230 / 6%);
--shadow-md:          0 4px 12px oklch(0.180 0.006 230 / 8%);
--shadow-lg:          0 8px 24px oklch(0.180 0.006 230 / 10%);
```

**Contrast verification**:

- `--ink` on `--bg`: ~13.5:1 (exceeds WCAG AAA 7:1)
- `--ink-secondary` on `--bg`: ~5.2:1 (exceeds WCAG AA 4.5:1)
- `--ink-tertiary` on `--bg`: ~3.5:1 (meets WCAG AA for large/UI text; use sparingly for body)
- `--ink-on-primary` on `--primary`: white on saturated mid-luminance — correct per Helmholtz-Kohlrausch
- `--ink-on-accent` on `--accent`: same rule applies

**Color usage rules**:

- `--primary` is used ONLY for primary action buttons, selected states, and focus indicators. Never for decoration.
- `--accent` is used for links, status badges, and secondary highlights. Not for primary CTAs.
- Semantic colors (`--success`, `--warning`, `--error`) appear only in their semantic context. Never used decoratively.
- Background stays pure white (`--bg`). No cream, no sand, no warm tint. The brand warmth comes from typography and accent, not the surface.

## Typography

### Font Stack

```
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", "Cascadia Code", "Fira Code", "Consolas", "Liberation Mono", monospace;
```

**Inter** is the primary family. One well-tuned sans-serif carries everything — headings, body, labels, buttons, data. No display/body pairing. No serif headings.

**JetBrains Mono** is available as a monospace option for note content (user preference). Not forced.

### Type Scale

Fixed rem scale — no fluid `clamp()` sizing. Product UI is viewed at consistent DPI.

| Step | Size     | Usage                                    |
| ---- | -------- | ---------------------------------------- |
| xs   | 0.75rem  | Captions, fine print, keyboard shortcuts |
| sm   | 0.875rem | Secondary text, metadata, timestamps     |
| base | 1rem     | Body text, labels, inputs, buttons       |
| lg   | 1.125rem | Note content (comfortable reading)       |
| xl   | 1.25rem  | Card titles, section headings            |
| 2xl  | 1.5rem   | Page titles                              |
| 3xl  | 2rem     | App name, primary page heading           |

Scale ratio: 1.125–1.2 between steps. Tight and functional.

### Typography Rules

- **Line height**: Body 1.6, headings 1.3, UI labels 1.2
- **Measure**: Note content max-width 65ch; list cards max 55ch
- **Weight**: Regular (400) for body, Medium (500) for emphasis, Semibold (600) for headings, Bold (700) sparingly
- **Letter spacing**: Normal for all text. No tracked-out uppercase. No tiny all-caps eyebrows.
- **`text-wrap: balance`** on page titles (h1–h2). **`text-wrap: pretty`** on note content.
- **Font smoothing**: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` on body
- No display fonts in UI labels, buttons, or data. This is a tool, not a poster.
- Monospace in note content must use the same base size but may need slight size adjustment for visual parity with sans.

## Layout System

### App Shell

```
┌──────────────────────────────────────────┐
│  Top bar: logo · search · new note (+)   │  ← 56px, persistent
├──────────────────────────────────────────┤
│                                          │
│  Content area                            │
│  • Note list (centered, max-w-2xl)       │
│  • Note detail (centered, max-w-prose)   │
│  • Forms (centered, max-w-lg)            │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

- **Top bar**: Persistent, minimal. Logo/app name left, primary action (New Note) right. Search in center for desktop, collapsed to icon on mobile.
- **Content area**: Centered column with `max-width` constraint. No side navigation. This is a single-purpose app.
- **No sidebar**. Notes apps with sidebars create visual noise. A list of notes IS the main view.
- **No footer**. Nothing to put there.

### Breakpoints

| Breakpoint | Width   | Behavior                                    |
| ---------- | ------- | ------------------------------------------- |
| Mobile     | < 640px | Single column, full-width content           |
| Tablet     | 640px+  | Centered content, comfortable margins       |
| Desktop    | 1024px+ | Wider content area, optional two-up editing |

### Responsive Rules

- **Mobile-first**: All styles start at mobile, then layer on wider breakpoints with `min-width` media queries.
- **Content width**: `max-width: 42rem` (672px) on mobile content; `max-width: 48rem` (768px) on desktop.
- **Touch targets**: Minimum 44×44px on all interactive elements. Spacing between adjacent controls ≥ 8px.
- **No horizontal scroll** under any circumstance. Long words break with `overflow-wrap: break-word`.

### Grid vs Flexbox

- **Flexbox** for 1D layouts: top bar, button groups, form rows, note list
- **Grid** for 2D layouts only. Not needed in current scope but reserved for potential note grid view.
- Never default to Grid when `flex-wrap` is simpler.

## Spacing System

Base unit: **4px** (0.25rem). All spacing is a multiple of this unit.

```
--space-0:   0;
--space-1:   0.25rem;   /*  4px */
--space-2:   0.5rem;    /*  8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-20:  5rem;      /* 80px */
```

### Spacing Rules

- **Page-level padding**: `--space-6` (24px) on mobile, `--space-10` (40px) on desktop
- **Between list items**: `--space-3` (12px) gap
- **Between sections**: `--space-8` (32px)
- **Inside cards**: `--space-4` (16px) padding
- **Form field gaps**: `--space-5` (20px) between fields, `--space-2` (8px) between label and input
- **Button internal padding**: `--space-2` (8px) vertical, `--space-4` (16px) horizontal
- **Inline spacing**: `--space-2` (8px) between icon and label
- Vary spacing for rhythm. Not every gap is the same. Content sections get more breathing room than UI chrome.

## Django Template Structure

### Organization

```
templates/
├── base.html                 ← Document shell, CSS, meta, blocks
├── notes/
│   ├── note_list.html        ← Note list view
│   ├── note_detail.html      ← Single note view
│   ├── note_form.html        ← Create / edit note
│   └── note_confirm_delete.html
├── partials/
│   ├── note_card.html        ← Reusable note preview card
│   ├── empty_state.html      ← Reusable empty state with icon + message
│   ├── form_field.html       ← Reusable form field with label + error
│   ├── top_bar.html          ← Persistent top bar
│   └── pagination.html       ← Pagination controls (when needed)
└── registration/
    ├── login.html
    └── signup.html
```

### Block Structure (base.html)

```django
{# base.html #}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Notes{% endblock %}</title>
    {% block extra_head %}{% endblock %}
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to content</a>
    {% include "partials/top_bar.html" %}
    <main id="main-content">
        {% block content %}{% endblock %}
    </main>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

### Template Rules

- **One `base.html`** that every page extends. No duplicate document shells.
- **Partial includes** for any UI piece used on more than one page. No copy-pasting card markup.
- **Context variables** drive display. Cards receive a `note` dict. Forms receive a `form` object.
- **No inline styles**. All styling lives in CSS files. Django's `{% static %}` for asset references.
- **Semantic HTML**: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>` used correctly.
- **Templates are logic-light**: conditionals for empty states and errors; loops for lists. Heavy logic in views.
- **CSRF tokens** on all POST forms.
- **Messages framework** for one-time notifications (note saved, note deleted). Use Django's `messages` with custom styling, not default Bootstrap alerts.

### Static Files

```
static/
├── css/
│   ├── reset.css             ← Minimal CSS reset
│   ├── tokens.css            ← CSS custom properties (colors, spacing, typography)
│   ├── base.css              ← Base element styles, layout
│   ├── components.css        ← Reusable component styles
│   └── utilities.css         ← Utility classes (sr-only, etc.)
├── js/
│   └── main.js               ← Minimal JS: focus management, keyboard shortcuts
└── fonts/                    ← Self-hosted Inter and JetBrains Mono subsets
```

### CSS Architecture

- **No Bootstrap**. No Tailwind. No CSS framework default look.
- **CSS custom properties** for all design tokens (from this document).
- **BEM-like naming** for components: `.note-card`, `.note-card__title`, `.note-card__meta`.
- **Component-scoped CSS files** loaded on every page (small enough to not need code splitting).
- **Reset**: A minimal reset (box-sizing, margin removal, font smoothing). Not normalize.css wholesale.

## Reusable UI Components

Every component listed below must have: default, hover, focus, active, disabled states defined.

### Button

Two variants: **primary** (filled indigo) and **secondary** (outlined/border-only on white).

```
Primary button:
  bg: --primary, text: --ink-on-primary
  hover: --primary-hover
  focus: 2px ring (--ring), 2px offset
  active: --primary-active
  disabled: opacity 40%, pointer-events none

Secondary button:
  bg: transparent, text: --ink, border: --border-strong
  hover: bg --surface
  focus: same ring as primary
  active: bg --border
  disabled: opacity 40%

Danger variant (delete):
  bg: --error, text: white
  hover: darker red
```

Height: 40px. Min width: 80px. Border-radius: 8px. Font: Inter Medium, 0.875rem.

Only icon buttons may be square (40×40). Icon + text buttons are always wider.

### Text Input

```
Default:
  bg: --bg, border: --border-strong, text: --ink
  height: 40px, padding: 8px 12px
  border-radius: 8px
  font: Inter Regular, 1rem

Focus:
  border: --primary, ring: --ring (3px, offset 0)
  outline: none

Error:
  border: --error
  ring: --error with alpha

Disabled:
  bg: --surface, text: --ink-tertiary, cursor: not-allowed

Placeholder:
  color: --ink-tertiary
```

### Textarea

Same visual language as text input. Min-height: 120px (grows with content). For note editing, min-height: 60vh.

### Note Card

The primary UI element. Represents a note in the list view.

```
.note-card:
  bg: --bg
  border-bottom: 1px solid --border
  padding: --space-4 (16px)
  cursor: pointer
  transition: background 150ms ease-out

.note-card:hover:
  bg: --surface

.note-card:focus-visible:
  ring inset (no offset needed since it's a full-width card)
```

Card structure:

```
┌─────────────────────────────────────────┐
│  Note title                    Jun 20   │  ← .note-card__title (Semibold, 1.125rem)
│  First two lines of note content trun…  │  ← .note-card__preview (--ink-secondary, 0.875rem)
└─────────────────────────────────────────┘
```

- **No card background** — cards sit directly on `--bg`. Only hover gets a tint.
- **No side-stripe borders**. No colored left border.
- **No shadow**. Cards are not elevated; they are items in a list.
- **Title**: Single line, truncated with ellipsis. Color `--ink`.
- **Preview**: Max 2 lines, truncated. Color `--ink-secondary`.
- **Date**: Right-aligned on same row as title. Color `--ink-tertiary`. Relative format ("2 hours ago", "Yesterday", "Jun 15").
- **Empty title**: Shows "Untitled" in `--ink-tertiary`, italic.

### Top Bar

```
┌──────────────────────────────────────────┐
│  Notes            🔍 Search…      + New  │  ← 56px height
└──────────────────────────────────────────┘
```

- **Height**: 56px. Fixed.
- **Background**: `--bg` with bottom border `--border`.
- **Left**: App name "Notes" in Inter Semibold, 1.125rem. Not a logo — just text.
- **Center**: Search input, collapses to icon on mobile.
- **Right**: "New Note" primary button. On mobile: just the "+" icon (44×44px touch target).

### Empty State

```
         ✦
    No notes yet
  Create your first note
      [+ New Note]
```

- **Icon**: A simple line-art icon or unicode symbol. Not an illustration. Not a 3D blob.
- **Message**: Centered. Heading in `--ink-secondary`, body in `--ink-tertiary`.
- **Action**: Primary button below. The empty state teaches the interface.
- **Spacing**: Generous vertical whitespace. The emptiness should feel intentional, not like a bug.
- **Never**: "Nothing here" or a bare `<p>` with no action.

### Loading / Skeleton

- **Note list loading**: 3–5 skeleton cards. Each is a gray block (`--border` color) with subtle shimmer animation. Width varies (title bar 60%, preview bar 90%) to mimic real content.
- **Note detail loading**: Skeleton title bar + skeleton content blocks.
- **No spinners** in the middle of empty content areas. Spinners only for button loading states (inside the button, replacing text).

### Toast / Notification

- Position: Bottom-center, floating above content.
- Background: `--ink` (dark), text: white.
- Auto-dismiss after 4 seconds.
- Slide up from bottom edge, fade out.
- Used for: "Note saved", "Note deleted — Undo".

### Dialog (when needed)

- Native `<dialog>` element or Django template modal include.
- Background: `--bg`. Border: 1px `--border`. Shadow: `--shadow-lg`. Border-radius: 12px.
- Backdrop: `oklch(0 0 0 / 30%)`, `backdrop-filter: blur(4px)`.
- Used only for destructive confirmations ("Delete this note?"). Everything else is inline.
- Escape closes. Click-outside closes. Focus trap inside while open.

### Pagination

- Simple "Older →" / "← Newer" links at bottom of note list.
- Not numbered pages. Notes are chronological, not random-access.
- Centered, using secondary button style.

## Forms Design

### Create / Edit Note Form

```
┌──────────────────────────────────────────┐
│                                          │
│  [Title input — large, borderless feel]  │
│                                          │
│  ─────────────────────────────────────   │  ← subtle divider
│                                          │
│  [Content textarea — fills remaining     │
│   viewport height, no visible border,    │
│   just a writing surface]                │
│                                          │
│                                          │
│                              [Save]      │  ← right-aligned
└──────────────────────────────────────────┘
```

- **Title input**: Font Inter Semibold, 1.5rem. No visible border — just a clickable text area with bottom divider line. Placeholder: "Untitled".
- **Content textarea**: Font Inter Regular or JetBrains Mono (user setting), 1.125rem. No visible border. Full available height. Resize: vertical only. Placeholder: "Start writing…".
- **Save button**: Primary, right-aligned. Also saves on Ctrl+S / Cmd+S.
- **No label elements** for title and content. The placeholders are the labels. This is a writing surface, not a database form.
- **Form is the page**. No card wrapping the form. No "Edit Note" heading. The note content IS the view.

### Delete Confirmation

- Inline confirmation, not a modal if the delete button is near the content.
- If delete is triggered from the list view, use a small dialog: "Delete this note? This action cannot be undone." with "Cancel" (secondary) and "Delete" (danger) buttons.

## Empty States

| Context            | Message            | Action                 |
| ------------------ | ------------------ | ---------------------- |
| No notes at all    | No notes yet       | Create your first note |
| Search no results  | No notes match "…" | Clear search           |
| After deleting all | All notes deleted  | Create a new note      |

- Each empty state has a clear next action. The user always knows what to do.
- Icons are simple and calm. Not playful or cartoony. Not absent either — a text-only empty state feels like an error.

## Error States

### 404 (Note Not Found)

```
That note doesn't exist
It may have been deleted or the link is wrong.
[← Back to notes]
```

- Centered. Calm. Helpful. No red alerts, no warning icons. The error is informational, not alarming.

### 500 (Server Error)

```
Something went wrong
We're on it. Try refreshing the page.
[Refresh page]
```

- Same calm treatment. No stack traces. No technical details exposed to user.

### Form Validation Errors

- Inline below the field that failed. Red text (`--error`), small font (0.875rem).
- Field border turns `--error`.
- Error message is specific: "Title cannot be empty" not "This field is required."
- Server-side errors rendered via Django's `form.errors` with custom error template.
- No alert banner at top of page. Errors live next to what they refer to.

### Network / Connection Errors

- If the app is an SPA (JS saves): toast at bottom: "Couldn't save. Check your connection. [Retry]"
- If traditional form POST: standard Django error page but styled with the same calm error pattern.

## Mobile Behavior

Mobile is **first-class**, not an afterthought.

### Layout

- **Single column**, full width.
- **Top bar**: 48px height (slightly shorter than desktop 56px). "Notes" title left. "+" icon button right. Search icon button.
- **Content**: `padding: 16px`. No max-width constraint — uses full screen width.

### Note List (Mobile)

- Cards span full width. Same design as desktop but no hover state (touch has no hover).
- Active state: brief background color change on touch (`--surface`) with 150ms transition.
- Swipe-to-delete: Not in v1. Use long-press or explicit delete button.

### Note Detail / Edit (Mobile)

- Full-screen writing surface. Top bar shows "← Notes" back button.
- Content textarea takes full remaining viewport height.
- Save button in top bar (replaces "+" with "Save").
- Keyboard-aware: On iOS/Android, the textarea should not be hidden behind the virtual keyboard.

### Navigation

- **Back button**: Always present on detail/edit screens. Arrow + "Notes" label.
- **No bottom tab bar**. The app has two primary screens (list, detail). A simple back button is enough.
- **No hamburger menu**. Nothing to hide in a drawer.

### Touch Targets

- Minimum 44×44px for all interactive elements (buttons, links, icons).
- Adjacent controls have ≥ 8px gap.
- No hover-dependent UI. Every interaction works on touch.

## Accessibility Rules

### Semantic HTML

- `<main>` wraps primary content; `id="main-content"` for skip link target.
- `<nav>` for top bar navigation elements.
- `<article>` for individual note content.
- `<form>` with proper `<label>` elements (even if visually hidden).
- Headings in logical order: h1 (page title), h2 (section), h3 (sub-section). No skipped levels.

### Keyboard Navigation

- **Skip link**: First focusable element, visible on focus. Skips to `#main-content`.
- **Focus order**: Logical DOM order matches visual order.
- **Focus visible**: Every interactive element has a visible focus ring (`--ring`, 3px, 2px offset from element). No `:focus { outline: none }` without a replacement.
- **Tab stops**: All buttons, links, inputs, and textareas are in tab order.
- **Keyboard shortcuts**: `Ctrl+K` / `Cmd+K` for search. `Ctrl+N` / `Cmd+N` for new note. `Ctrl+S` / `Cmd+S` for save. `Esc` to close search / dialogs / return to list.

### Screen Readers

- **Page title**: `<title>` updates dynamically to reflect current view: "Notes", "Note Title — Notes", "Edit Note — Notes".
- **Icon-only buttons**: Always have `aria-label`. Search icon = `aria-label="Search notes"`. New note "+" = `aria-label="New note"`.
- **Live regions**: Toast notifications use `role="status" aria-live="polite"`.
- **Form errors**: Announced via `aria-describedby` linking the error message to the input.
- **Loading states**: Spinner/loader has `role="status" aria-label="Loading notes"`.
- **Note cards**: Each card is a link/button wrapping the note content. Has `aria-label` with note title for quick scanning.

### Color & Contrast

- All text meets WCAG AA (4.5:1 for body, 3:1 for large text). The palette was chosen to exceed these.
- No information conveyed by color alone. Status indicators always include text or icon.
- Focus rings are high-contrast and visible in both light mode and any future dark mode.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- All animations gated behind `prefers-reduced-motion: no-preference`.
- Instant transitions (0.01ms) as the fallback. No content hidden behind animation triggers.

### Touch & Pointer

- No `hover`-only interactions. Every hover effect has a parallel `focus-visible` or `active` effect.
- No `title` attributes for critical information (not accessible on touch).
- Sufficient spacing between interactive elements (≥ 8px).

## Animation & Microinteraction Rules

### Principles

- **Motion conveys state, not decoration.** A note appearing, a button responding, a page transitioning — these deserve motion. Welcome-page choreography does not.
- **150–250ms duration** for most transitions. Users are in flow; don't make them wait.
- **Ease-out** curves only. `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo feel). No bounce, no elastic, no ease-in-out.
- **All animations gated** behind `prefers-reduced-motion: no-preference`.

### Specific Animations

| Interaction                 | Duration | Easing      | Description                              |
| --------------------------- | -------- | ----------- | ---------------------------------------- |
| Button hover/focus          | 150ms    | ease-out    | Background and shadow transition         |
| Input focus ring            | 150ms    | ease-out    | Border color and box-shadow transition   |
| Note card hover             | 150ms    | ease-out    | Background color fade to `--surface`     |
| Note card appear (new note) | 250ms    | ease-out    | Fade in + slight vertical slide (8px)    |
| Note card remove (delete)   | 200ms    | ease-out    | Fade out + slight vertical collapse      |
| Toast appear                | 200ms    | ease-out    | Slide up from bottom + fade in           |
| Toast dismiss               | 300ms    | ease-out    | Fade out                                 |
| Dialog open                 | 200ms    | ease-out    | Fade in backdrop + scale dialog (0.97→1) |
| Dialog close                | 150ms    | ease-out    | Fade out                                 |
| Page transition (if SPA)    | 200ms    | ease-out    | Crossfade (opacity 0→1)                  |
| Skeleton loading shimmer    | 1.5s     | ease-in-out | Subtle shimmer sweep across placeholder  |

### What NOT to Animate

- Page load sequences. The app loads into a task; users don't want to watch it load.
- Staggered list reveals. Notes appear instantly. At most, a single new note gets a brief appear animation.
- Scroll-triggered reveals. This is a tool, not a landing page.
- Background color gradients or hue rotations.
- Logo animations or decorative motion.

## Anti-Patterns to Avoid

These are banned outright. If you're about to write any of these, rewrite.

### Shared Absolute Bans (from impeccable skill)

- **Side-stripe borders** on cards, list items, or callouts. No `border-left: 3px solid var(--primary)`.
- **Gradient text**. No `background-clip: text` with gradient backgrounds. Use solid colors.
- **Glassmorphism**. No backdrop-filter blur cards, no glass effects.
- **Hero-metric template**. No "big number + small label" stats sections.
- **Identical card grids**. No 3-up icon + heading + text card rows.
- **Tiny uppercase tracked eyebrows**. No "NOTE" / "QUICK CAPTURE" / "YOUR THOUGHTS" above sections.
- **Numbered section markers**. No `01 · About` / `02 · Process` scaffolding.

### Product-Specific Bans (from product register)

- **Default Bootstrap look**: Blue buttons, default system fonts, alert bars, unstyled tables. If Django admin uses Bootstrap, the custom app must not.
- **Cream/sand/beige backgrounds**: The `--bg` is pure white. Warmth comes from typography and accent, not the surface.
- **Over-decorated buttons**: No gradients, no shadows on static buttons, no pill shapes with excessive border-radius.
- **Inconsistent form controls**: Every text input looks the same. Every button looks the same. No one-off styling.
- **Modals as first resort**: Exhaust inline alternatives before using a dialog. Only delete confirmations use modals.
- **Spinners in empty content areas**: Empty states show a message. Loading shows skeletons. Spinners are for button loading only.
- **Display fonts in UI**: Inter Regular/Medium/Semibold only. No decorative type in the interface.
- **Decorative color**: `--primary` and `--accent` are functional, not decorative. No colored backgrounds behind text, no tinted sections for visual variety.
- **Horizontal rules as decoration**: `<hr>` only between meaningful sections, not between every list item.

### Category-Reflex Check

- **First-order**: This is a notes app. The reflex is "warm paper / craft / journal aesthetic" — cream backgrounds, serif headings, notebook textures. **Rejected.** This is a digital tool, not a physical notebook simulation.
- **Second-order**: The anti-reflex is "terminal-native dark mode / monospace-only / hacker aesthetic." **Rejected.** The user reference is Apple Notes — clean, light, readable, universal. Not terminal-esque, not craft-paper, not hacker-journal.
