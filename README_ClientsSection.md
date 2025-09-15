ClientsSection — Trusted by

Overview
- Minimal, fast, and accessible “Trusted by” section with two variants: grid and marquee.
- Technology: React + TypeScript. Styling uses a scoped CSS file (Tailwind not detected).

Design Tokens
- bg/base: #0D0812
- surface: #14121C
- text: #F3F4F6
- muted: #9CA3AF
- primary: #E83D6F (tiny accents only)
- secondary: #33E1FF (hover/selection accents)
- accent: #9A68FF (rare)
- Radii: 12px
- Spacing: 8px scale (8,16,24,32,40)
- Typography: Headings serif (Playfair Display fallback); body sans (Inter/system)

Exports
- types/clients.ts
  - export type ClientLogo = { name: string; src?: string; href?: string };
  - export type ClientsSectionProps = {
      variant?: 'grid' | 'marquee';
      title?: string;
      logos: ClientLogo[];
      grayscale?: boolean;
      maxColumns?: 4 | 5 | 6;
    };
  - export const DEFAULT_CLIENTS: ClientLogo[];

Component
- components/ClientsSection.tsx
  - <section aria-labelledby="clients-title"> with <h2 id="clients-title">Clients we have worked with</h2>
  - Props:
    - variant: 'grid' | 'marquee' (default 'grid')
    - title: string (default: "Clients we have worked with")
    - logos: ClientLogo[] (required; defaults to DEFAULT_CLIENTS if omitted)
    - grayscale: boolean (default true; logos gray until hover)
    - maxColumns: 4 | 5 | 6 (default 5; grid density)

Behavior
- Grid: responsive columns — xs:2, sm:3, md:4, lg:maxColumns
- Marquee: two counter-scrolling rows, 30s per loop, linear, infinite
  - Duplicates the logos array once for continuous looping
  - Pauses on hover for pointer devices
  - Respects reduced motion (animation disabled)

Logo Rendering Rules
- If src: renders <img> with height 32px (40px ≥768px), object-contain, lazy/async/low priority
- If no src: renders text badge with 12px radius, 1px border, 8x16 padding
- If href: wraps in <a target="_blank" rel="noopener noreferrer">; otherwise non-interactive <div role="img">
- Keyboard focus: strong 2px outline in secondary color

Usage
```
import ClientsSection from './src/components/ClientsSection';
import { DEFAULT_CLIENTS, ClientLogo } from './src/types/clients';

// Grid (default)
<ClientsSection logos={DEFAULT_CLIENTS} />

// Grid with images and 6 columns
const logos: ClientLogo[] = [
  { name: 'Duolingo', src: '/logos/duolingo.svg', href: 'https://duolingo.com' },
  // ...more
];
<ClientsSection variant="grid" maxColumns={6} logos={logos} grayscale />

// Marquee
<ClientsSection variant="marquee" logos={DEFAULT_CLIENTS} grayscale={false} />
```

Notes
- Provide monochrome SVGs for best visual consistency.
- Images should be optimized and ideally inline SVGs.
- The marquee duplicates the list once; duplicate items are marked aria-hidden.
- All animations and underline entrance are disabled if prefers-reduced-motion is enabled.

Testing Ideas
- Heading renders with provided or default title.
- Grid renders exactly logos.length unique items.
- Marquee renders duplicated nodes with aria-hidden on clones.
- Reduced motion removes animation styles.
- Each <img> alt equals the brand name.
