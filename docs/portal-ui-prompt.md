# Claude-Design prompt — Internal CMS Portal UI

Paste the prompt below into **Claude Design** (or Claude with the design skill) to generate the internal
portal's UI. It bakes in the brand tokens harvested from the existing `/internal` pages so the output
matches the live site. After generation, the screens get wired to the backend described in
[`architecture.md`](./architecture.md) §3–4 (Supabase/Google auth + Sanity write path).

> **Note for the wiring pass:** the generated UI is presentational only. Auth is Supabase + Google SSO
> (domain-locked to `@fruitionservices.io`), and Publish calls the server-side `upsertBlogPost()` path —
> the design does not need to implement those, just leave clear hooks (form submit handlers, an
> `onPublish`, an `onSaveDraft`, a "Sign in with Google" button).

---

## The prompt

> Design an **internal content-management portal** for a Monday.com consulting agency called **Fruition**.
> It is an auth-gated staff tool where blog writers and SEO specialists create and manage blog posts. It
> is NOT public — it should feel like a focused, modern SaaS admin, not a marketing site.
>
> **Brand & visual system** (match these exactly):
> - Primary purple: `#8015E8` (use for primary buttons, active states, accents).
> - Heading ink: `#10003a`.
> - Secondary text: a muted slate/grey.
> - Surfaces: white cards with generously rounded corners (a `rounded-card` ~16px radius) and a soft,
>   diffuse card shadow.
> - Pill-shaped small elements (badges, icon chips) — `rounded-pill`.
> - Page background: subtle purple radial gradient fading to white —
>   `radial-gradient(ellipse at top, rgba(128,21,232,0.18) 0%, rgba(255,255,255,0) 55%)` over a
>   `linear-gradient(180deg, #f7f3ff 0%, #ffffff 100%)`.
> - Icons: `lucide-react`.
> - Framework: **React + Tailwind CSS v4**. Clean, spacious, accessible, keyboard-friendly, responsive.
>
> **Screens to design:**
>
> 1. **Login** — a centered card on the gradient background. A lock icon in a soft-purple rounded chip,
>    the heading "Fruition Internal", a short subtitle, and a single primary **"Sign in with Google"**
>    button. Small helper text: "Only @fruitionservices.io Google Workspace accounts can sign in."
>
> 2. **Dashboard** — an app shell with a left sidebar (nav: Dashboard, Blog posts, My profile; Fruition
>    wordmark at top; sign-out at the bottom). Main area: a greeting ("Welcome back, {name}"), a row of
>    3 stat tiles (Published posts, Drafts, Your posts this month), a prominent primary **"New blog post"**
>    button, and a "Recent posts" list beneath.
>
> 3. **Blog list** — same app shell. A table (or responsive card grid) of posts showing: title, author,
>    status badge (Draft = amber pill, Published = green pill), category, and date. A search field plus
>    filter dropdowns for category and industry, and a "New post" button top-right. Each row has an Edit
>    action.
>
> 4. **Blog editor** — the core screen. A two-pane layout:
>    - **Left pane:** a **Markdown editor** with a formatting toolbar (H2, H3, bold, italic, link,
>      bullet list, numbered list, and an image-upload button). A large monospace-ish editing area.
>    - **Right pane:** a **live rendered preview** of the Markdown, styled like a real blog article.
>    - **Right sidebar (metadata panel):** Title (large input at top, spanning), Slug (auto-derived from
>      title, editable, with the URL prefix shown), Excerpt (textarea), Cover image (drag-and-drop upload
>      with thumbnail preview + replace/remove), Categories (multi-select chips), Industry (single-select
>      dropdown), SEO title + Meta description (each with a live character counter and a soft warning when
>      over the recommended length), and a Publish date picker.
>    - **Sticky action bar:** "Save draft" (secondary), "Preview" (ghost), and "Publish" (primary purple).
>      Show a subtle "Saved • 2s ago" autosave indicator.
>
> 5. **My profile** — a form card to edit the author's public profile: display name, role, bio (textarea),
>    LinkedIn URL, region (select), and a photo upload with circular preview. Note this maps to the
>    author profile shown on the public site. Primary "Save profile" button.
>
> **Deliverables:** production-ready React + Tailwind components, one per screen, sharing a common app-shell
> layout (sidebar + header). Use `lucide-react` icons. Include empty states (e.g. "No posts yet — write
> your first one") and loading skeletons for the list and editor. Do not implement real auth or API calls —
> expose clear props/handlers (`onSignIn`, `onPublish`, `onSaveDraft`, `onUploadImage`, form `onSubmit`) so
> the screens can be wired to the backend later.

---

## Fields the editor must capture (map to the `blogPost` schema)

For reference when wiring — these mirror `src/sanity/schemas/blogPost.ts`:

| UI field | Sanity field | Notes |
|---|---|---|
| Title | `title` | required |
| Slug | `slug.current` | auto from title, editable |
| Excerpt | `excerpt` | text |
| Cover image | `coverImage` | upload → `uploadImageAsset()` → image reference |
| Categories | `categories` | references to `blogCategory` docs |
| Industry | `industry` | enum: construction, hr, real-estate, marketing, saas, professional-services, manufacturing, product |
| SEO title | `seoTitle` | string |
| Meta description | `seoDescription` | text |
| Publish date | `publishedAt` | datetime |
| Body (Markdown) | `body` | Markdown → `bodyToPortableText()` → Portable Text |
| Author | `author` | auto-filled from the logged-in user's profile |
