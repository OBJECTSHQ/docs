# AGENTS.md

> A README for AI coding agents

## Project Overview

OBJECTS documentation site built with [Vocs](https://vocs.dev) - a minimal documentation framework powered by React and Vite.

## Setup Commands

```bash
bun install      # Install dependencies
bun run dev      # Start development server (http://localhost:5173)
bun run build    # Build for production
bun run preview  # Preview production build
```

## Project Structure

```
docs/
├── pages/          # Documentation pages (MDX/MD)
│   ├── index.mdx   # Homepage (landing layout)
│   └── ...         # Other doc pages
├── public/         # Static assets (logos, images)
└── footer.tsx      # Custom footer component
vocs.config.ts      # Vocs configuration
```

## Code Style

### SVG Files

Use this simple structure for Safari compatibility:

```svg
<svg width="X" height="Y" viewBox="0 0 X Y" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Use fill attribute on shapes, not inline styles -->
  <path d="..." fill="black"/>
</svg>
```

Avoid:
- XML declarations (`<?xml ...?>`) and DOCTYPEs
- Extra namespaces (`xmlns:xlink`, `xmlns:serif`)
- Deeply nested group wrappers
- Inline styles (`style="fill: rgb(...)"`) - use `fill` attribute instead

### Documentation Pages

- Use MDX for pages requiring components
- Use standard Markdown for simple content
- Homepage uses `layout: landing` frontmatter

## Configuration

Main config is in `vocs.config.ts`:
- `logoUrl` - Logo for sidebar/header
- `iconUrl` - Favicon
- `sidebar` - Navigation structure
- `socials` - Social links (Twitter, GitHub, Warpcast)

## Agent Guidelines

### Parallel Execution

Use parallel agents/tool calls whenever tasks are independent:
- Multiple file reads or searches
- Independent git commits (stage + commit can be parallelized across different file groups)
- Running build/lint/test commands that don't conflict

Avoid parallelization when:
- Tasks have dependencies (e.g., must read file before editing)
- Commands modify shared state sequentially
