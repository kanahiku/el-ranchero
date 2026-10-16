# Poster (Variant 3) decorative artwork

Source: Figma file `n1jiyrhTNxkjJtenbVWfKR`, frame "Variant 3" (`2024:570`).
All fills are `currentColor`; set the colour with a `--v3-*` token in CSS.
Import as inline components (`import ArtEagle from '~/assets/images/v3/art-eagle.svg'`)
with `class="v3-art v3-art-…"` and `aria-hidden="true"`. `.v3-art` is hidden below `md`.

## Rules

- Decoration only. Never put text inside artwork, never let it sit behind body copy.
- At most two pieces per page section group; most sections get none.
- Prefer corners and empty header space; let pieces "peek" off the section edge.
- Repeat a piece on one page only when the two spots are far apart and one of them is quieter.

## Inventory

| File                            | Figma node                | Default colour                         | Use on                                                 |
| ------------------------------- | ------------------------- | -------------------------------------- | ------------------------------------------------------ |
| `art-eagle.svg`                 | `2074:1410`               | `--v3-cream`                           | Red bands, top-right of header row                     |
| `art-agave.svg`                 | `2074:1065`               | `--v3-paper`                           | Red/ink bands, bottom-left peek (needs a clear corner) |
| `art-cactus.svg`                | `2074:1170`               | `--v3-ink` at 22% on paper             | Corner peek. Cream at 55% when the section is ink      |
| `art-daisy.svg`                 | `2032:1116`               | `--v3-gold`                            | Behind a photo with open space. Skip full-bleed photos |
| `art-flourish.svg`              | `2074:1681` / `2074:1684` | `--v3-paper`                           | Centred at the bottom of an ink section                |
| `art-wordmark.svg`              | `2074:1691`               | `--v3-red`                             | Footer only                                            |
| `calavera.svg`, `calavera2.svg` | Deco / Calavera           | built-in                               | Gold bands, flanking a centred card                    |
| `Lanterns.astro`                | Deco / Lantern Garland    | tokens                                 | Top of page banners                                    |
| `Starburst.astro`               | Shape / Starburst         | tokens                                 | Homepage hero only. Keep it off interior banner photos |
| `Blossom.astro`                 | `2032:1122`               | `--v3-ink` on red, `--v3-red` on paper | Cropped at a corner as backing for cream line art      |

## Placements

| Page                       | Section                | Artwork                                                  |
| -------------------------- | ---------------------- | -------------------------------------------------------- |
| `/`                        | Hero, reviews          | Lanterns, starburst, blossoms, calaveras                 |
| `/menu`                    | Banner                 | Lanterns only (nothing on the photo)                     |
| `/menu`                    | Explore Our Menu       | Red blossom cropped top-right; agave `scaleY(-1)` on it  |
| `/menu`                    | Breakfast (ink)        | Flourish centred at the bottom; cactus peek, bottom-left |
| `/menu`                    | Choose Your Meat (red) | Ink blossom cropped at the top-right, eagle in front     |
| `/menu`                    | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu`                    | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/breakfast`          | Banner                 | Lanterns only                                            |
| `/menu/breakfast`          | Breakfast menu         | Red blossom and agave, top-right                         |
| `/menu/breakfast`          | Takeout (ink)          | Flourish centred at the bottom                           |
| `/menu/breakfast`          | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/breakfast`          | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/tacos`              | Banner                 | Lanterns only                                            |
| `/menu/tacos`              | Tacos (paper)          | Red blossom and agave, top-right                         |
| `/menu/tacos`              | Choose Your Meat (red) | Ink blossom, eagle in front                              |
| `/menu/tacos`              | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/tacos`              | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/burritos`           | Banner                 | Lanterns only                                            |
| `/menu/burritos`           | Burritos (paper)       | Red blossom and agave, top-right                         |
| `/menu/burritos`           | Choose Your Meat (red) | Ink blossom, eagle in front                              |
| `/menu/burritos`           | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/burritos`           | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/entrees`            | Banner                 | Lanterns only                                            |
| `/menu/entrees`            | Entrees (paper)        | Red blossom and agave, top-right                         |
| `/menu/entrees`            | Molcajete (ink)        | Flourish centred at the bottom                           |
| `/menu/entrees`            | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/entrees`            | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/drinks`             | Banner                 | Lanterns only                                            |
| `/menu/drinks`             | Margaritas (paper)     | Red blossom and agave, top-right                         |
| `/menu/drinks`             | Explore more (paper)   | Cactus, bottom-right peek                                |
| `/menu/drinks`             | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/kids`               | Banner                 | Lanterns only                                            |
| `/menu/kids`               | Kids menu (paper)      | Red blossom and agave, top-right                         |
| `/menu/kids`               | Explore more (paper)   | Cactus, bottom-right peek                                |
| `/menu/kids`               | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/specials`           | Banner                 | Lanterns only                                            |
| `/menu/specials`           | Daily specials (paper) | Red blossom and agave, top-right                         |
| `/menu/specials`           | Meat choices (red)     | Ink blossom, eagle in front                              |
| `/menu/specials`           | Weekend specials (ink) | None                                                     |
| `/menu/specials`           | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/specials`           | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/quesadillas-nachos` | Banner                 | Lanterns only                                            |
| `/menu/quesadillas-nachos` | Quesadillas (paper)    | Red blossom and agave, top-right                         |
| `/menu/quesadillas-nachos` | Choose Your Meat (red) | Ink blossom, eagle in front                              |
| `/menu/quesadillas-nachos` | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/quesadillas-nachos` | Allergy (gold)         | Calaveras flanking the card                              |
| `/menu/appetizers-sides`   | Banner                 | Lanterns only                                            |
| `/menu/appetizers-sides`   | Appetizers (paper)     | Red blossom and agave, top-right                         |
| `/menu/appetizers-sides`   | Add-ons (red)          | Ink blossom, eagle in front                              |
| `/menu/appetizers-sides`   | Order (paper)          | Cactus, bottom-right peek                                |
| `/menu/appetizers-sides`   | Allergy (gold)         | Calaveras flanking the card                              |
| `/locations`               | Banner                 | Lanterns only                                            |
| `/locations`               | Restaurant cards       | Red blossom and agave, top-right                         |
| `/locations`               | Same menu (ink)        | Flourish centred at the bottom                           |
| `/locations`               | Group meal             | Cactus, bottom-right peek                                |
| `/about`                   | Banner                 | Lanterns only                                            |
| `/about`                   | Our Story              | Red blossom and agave, top-right                         |
| `/about`                   | Local Partners (ink)   | Flourish centred at the bottom                           |
| `/about`                   | The Murals             | Cactus, bottom-right peek                                |
| `/events`                  | Banner                 | Lanterns only                                            |
| `/events`                  | Weekly events (red)    | Ink blossom cropped at the top-right, eagle in front     |
| `/events`                  | Instagram (paper)      | Red blossom and agave, top-right                         |
| `/events`                  | Next Headline Concert  | Flourish centred at the bottom                           |
| `/events`                  | Friday Promoter Nights | Cactus, bottom-right peek                                |
| `/catering`                | Banner                 | Lanterns only                                            |
| `/catering`                | Request form (paper)   | Red blossom and agave, top-right                         |
| `/catering`                | Occasions (red)        | Ink blossom cropped at the top-right, eagle in front     |
| `/catering`                | Why Cater (ink)        | Flourish centred at the bottom                           |
| `/catering`                | FAQs (paper)           | Cactus, bottom-right peek                                |
| `/catering`                | Reviews (gold)         | Calaveras flanking the quotes                            |
