# Architecture: Block-Based Page Builder

## Overview

This project uses a **modular block-based page builder** pattern. Pages are composed of reusable content blocks managed in Sanity CMS and rendered by a generic `BlockRenderer` component.

## Key Concepts

### Document Types

Document types represent full pages or global settings in Sanity.

- **homePage** — Singleton document for the homepage. Contains an array of `contentBlocks`.
- **siteSettings** — Global site configuration (phone, calendly link, logo, etc.).
- Existing document types (blogPost, solutionPage, locationPage, etc.) remain unchanged.

### Block Objects

Block objects are Sanity object types that represent a single section of a page. Each block has:

- A `_type` matching its schema name (e.g. `heroBlock`)
- A hidden `blockType` string field for identification
- Content fields specific to that block type

Current blocks:

| Block | Purpose |
|-------|---------|
| `heroBlock` | Page hero with heading, subheading, CTA |
| `richTextBlock` | Portable text / rich content |
| `ctaBlock` | Call-to-action with heading, body, link |
| `featureListBlock` | List of features with icon/title/description |
| `testimonialBlock` | Single testimonial quote |
| `logoCloudBlock` | Grid of logos with images |
| `postListBlock` | Auto-fetches recent blog posts |
| `faqBlock` | Question/answer pairs |

### Page Composition

A page document (like `homePage`) has a `contentBlocks` field — an array that accepts any of the block types. Content editors can add, reorder, and configure blocks freely in Sanity Studio.

## Folder Structure

```
src/
  sanity/
    schemas/
      objects/          # Block object schemas (heroBlock.ts, ctaBlock.ts, etc.)
      documents/        # Document schemas (homePage.ts)
      index.ts          # Exports all schema types
    client.ts           # Sanity client
    image.ts            # Image URL builder
    queries.ts          # Existing query functions
  features/
    page-builder/
      BlockRenderer.tsx # Switch/case component mapping _type to view
      blocks/           # One view component per block type
    content/
      loaders.ts        # Data-fetching functions (getHomePage, getSiteSettings)
  app/
    page.tsx            # Homepage — uses BlockRenderer or fallback
    studio/             # Sanity Studio route
    ...                 # Existing route pages (unchanged)
  components/           # Shared components (Navbar, Footer, etc.)
```

## How It Works

1. **Sanity Studio** — Editors create/edit the `homePage` document and compose `contentBlocks`.
2. **Loader** (`src/features/content/loaders.ts`) — `getHomePage()` fetches the document with all blocks.
3. **Page** (`src/app/page.tsx`) — Server component calls the loader, passes blocks to `BlockRenderer`.
4. **BlockRenderer** — Iterates over blocks, matches `_type` to the correct view component.
5. **Block View** — Renders the block's content as plain HTML.

### Homepage Fallback

If no `homePage` document exists in Sanity yet, the homepage falls back to displaying site settings (site name, phone, calendly link) with a prompt to create the document in the Studio.

## How to Add a New Block Type

1. **Create the schema** in `src/sanity/schemas/objects/myNewBlock.ts`:
   ```ts
   import { defineType, defineField } from 'sanity'

   export default defineType({
     name: 'myNewBlock',
     title: 'My New Block',
     type: 'object',
     fields: [
       defineField({
         name: 'blockType',
         type: 'string',
         hidden: true,
         initialValue: 'myNewBlock',
       }),
       // ... your fields
     ],
   })
   ```

2. **Register it** in `src/sanity/schemas/index.ts` — import and add to `schemaTypes`.

3. **Add it to page documents** — In the relevant document schema (e.g. `homePage.ts`), add `defineArrayMember({ type: 'myNewBlock' })` to the `contentBlocks` array.

4. **Create the view** in `src/features/page-builder/blocks/MyNewBlockView.tsx`.

5. **Register in BlockRenderer** — Add a `case 'myNewBlock':` in the switch statement in `BlockRenderer.tsx`.

## How to Add a New Page Type

1. Create a document schema in `src/sanity/schemas/documents/` with a `contentBlocks` array field.
2. Register it in the schemas index.
3. Create a loader function in `src/features/content/loaders.ts`.
4. Create a route in `src/app/` that uses the loader and `BlockRenderer`.

## Conventions

- **Schemas**: camelCase names matching filenames (`heroBlock.ts` exports `name: 'heroBlock'`)
- **Views**: PascalCase with `View` suffix (`HeroBlockView.tsx`)
- **Loaders**: `get` prefix (`getHomePage()`)
- **TypeScript**: All files use TypeScript
- **Styling**: Minimal — this is a structural pass; design comes later
