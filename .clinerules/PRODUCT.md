# Product

## Register

product

## Users

Individual knowledge workers, students, and anyone who captures thoughts digitally. The user is typically in a focused state — studying, planning, journaling — and needs the tool to disappear so thinking can happen. They open the app, write, and leave. The app is not a destination; it is a thinking surface.

**Context**: desk, couch, phone on the go. Used in short bursts (capture a thought, 30 seconds) and longer sessions (writing, organizing, 30+ minutes).

**Job to be done**: Capture, find, and revisit notes with zero friction. The note should cost nothing to create.

## Product Purpose

A distraction-free personal notes app built as a learning Django project. It exists to teach Django fundamentals while producing a genuinely usable, well-designed tool — not a throwaway tutorial project.

**Success**: A user can create a note in under 2 seconds, scroll through notes effortlessly, and trust that nothing will lose their work. The interface should feel like a carefully made product, not a school assignment.

## Brand Personality

**Calm, focused, minimal.** Three words, one stance: the app is quiet. It does not compete for attention. It does not decorate. It treats the user's content with respect — generous whitespace, thoughtful typography, nothing superfluous.

**Voice**: Direct, brief, warm but not chatty. Labels say "New note" not "Let's create something amazing!" Error messages apologize and explain, never blame.

## Product Tone

The app speaks like a thoughtful assistant, not a cheerleader or a manual.

| Situation          | Tone                                    | Example                                    |
| ------------------ | --------------------------------------- | ------------------------------------------ |
| Empty state        | Encouraging, clear next step            | "No notes yet. Create your first note."    |
| Success            | Quiet confirmation, sometimes invisible | "Saved" (toast, auto-dismiss)              |
| Error (user)       | Helpful, specific, no blame             | "Title can't be empty" not "Invalid input" |
| Error (system)     | Calm, transparent, actionable           | "Couldn't save. Check your connection."    |
| Destructive action | Clear, allows undo, asks once           | "Note deleted. Undo?" (4s toast)           |
| Loading            | Reassuring that things are working      | Skeleton cards, not "Please wait…"         |

**Rules**:

- No exclamation marks unless something is genuinely exciting (nothing is).
- No emoji in interface copy.
- No "Oops!", "Uh-oh!", "Yikes!" — the app is calm, not cutesy.
- No passive voice ("The note was deleted"). The app takes responsibility: "Note deleted."
- Sentence case for everything: "New note" not "New Note".

**Reference**: Apple Notes — clean, fast, mobile-first, chrome-receding. iA Writer — focus mode, monospace option, content is king. Linear — keyboard-first, precise, dark mode done right.

## Anti-references

- **Default Bootstrap look**: Blue buttons, default system fonts, unstyled form controls, generic alert bars. The tutorial-template aesthetic.
- **Over-designed SaaS**: Glass cards, gradient text, bounce-on-scroll animations, purple-to-blue gradients, decorative blobs. Decoration without purpose.
- **Enterprise dashboard**: Dense data tables, sidebar sprawl, gray-on-gray-on-gray, infinite configuration panels.
- **AI-template feel**: Cream/beige body backgrounds, tiny uppercase tracked eyebrows above every section, numbered section markers, gradient text.

## Core User Flows

### Flow 1: Capture a thought (primary)

1. Open app → note list appears
2. Tap "+" (or Ctrl+N) → blank note opens instantly
3. Type title, type content
4. Tap Save (or Ctrl+S) → note appears in list
5. **Time target**: Under 2 seconds from open to first keystroke

### Flow 2: Find and read a note

1. Scroll through note list or type in search
2. Tap a note card → note opens in read view
3. Read, then either edit (tap Edit) or go back to list
4. **Time target**: Under 3 seconds from search to reading

### Flow 3: Edit a note

1. Open a note → tap Edit (or just start typing if always-editable)
2. Modify title or content
3. Save (Ctrl+S) or back (auto-save)
4. Return to list

### Flow 4: Delete a note

1. From list: tap delete icon on card → confirm → note removed
2. From detail: tap Delete → confirm → return to list
3. Undo available via toast for 4 seconds

### Flow 5: Search notes

1. Tap search (or Ctrl+K) → search field focuses
2. Type query → list filters in real time
3. Tap result → note opens
4. Clear search → full list returns

## Main Screens

| Screen              | Purpose                                  | Primary element         |
| ------------------- | ---------------------------------------- | ----------------------- |
| Note List           | Browse, search, and manage all notes     | Note cards with preview |
| Note Detail         | Read a single note                       | Full note content       |
| Note Edit / Create  | Write or edit a note                     | Title + content form    |
| Delete Confirmation | Confirm destructive action               | Dialog with two buttons |
| Empty State         | First-run experience when no notes exist | Prompt to create first  |
| Error (404/500)     | Graceful error handling                  | Message + back action   |

## Functional Priorities

**Phase 1 — Core (must have)**

- Create, read, update, delete notes (CRUD)
- Note list with title preview and date
- Search / filter notes by title
- Mobile-responsive layout
- Empty states and error states
- WCAG AA keyboard and screen reader support

**Phase 2 — Polish (should have)**

- Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+K, Esc)
- Toast notifications for save/delete with undo
- Auto-save while editing
- Skeleton loading states
- Monospace font option for note content
- Relative timestamps ("2 hours ago")

**Phase 3 — Extend (nice to have)**

- Dark mode
- Pin / favorite notes
- Note categories or tags
- Export notes (plain text, markdown)
- Full-text search (database-backed)

## Design Principles

1. **Get out of the way** — The interface recedes. Chrome is minimal. The note content is the only thing that matters on screen.
2. **One screen, one task** — Each view does one thing clearly. List notes. Read a note. Write a note. No multitasking dashboards.
3. **Typographic clarity** — Reading and writing deserve thoughtful type. Generous line height, comfortable measure, clear hierarchy.
4. **Instant and invisible** — Interactions resolve in 150–250ms. No one waits for choreography in a notes app. State changes are immediate feedback, not performance.
5. **Consistency is comfort** — The same button shape, same spacing rhythm, same form vocabulary across every screen. Familiarity earns trust.

## What This App Is Not

- Not a collaborative editor (no real-time sync, no presence, no comments)
- Not a knowledge graph (no backlinks, no graph view, no block references)
- Not a task manager (no due dates, no Kanban, no assignments)
- Not a rich document editor (no tables, no embeds, no databases)
- Not a file storage system (no attachments beyond minimal image support)

It is a notes app. Notes are text. Text is enough.

## Accessibility & Inclusion

- **Target**: WCAG 2.1 AA compliance
- **Contrast**: All body text ≥ 4.5:1 against background; large text ≥ 3:1
- **Keyboard**: Every action reachable via keyboard; visible focus rings on all interactive elements
- **Screen readers**: Semantic HTML, ARIA labels on icon-only controls, live regions for dynamic content
- **Motion**: Respect `prefers-reduced-motion`; all animations have instant-fallback
- **Touch**: Minimum 44×44px touch targets on mobile; adequate spacing between interactive elements
