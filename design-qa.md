# UI-001 visual QA

Result: **passed** for the approved functional scope; remaining differences below are intentional or inherited assets.

| Screen | Prototype | React implementation | Comparison |
|---|---|---|---|
| Home | `docs/design/reviews/ui-001/prototype-home-mobile-390.png` | `docs/design/reviews/ui-001/home-mobile-390.png` | Same 390 × 844 px capture. React uses the existing SVG scene and a compact instruction flow; prototype uses a silhouette hero. Both keep the mystery hidden and foreground the start action. |
| Game | `docs/design/reviews/ui-001/prototype-game-mobile-390.png` | `docs/design/reviews/ui-001/game-mobile-390.png` | Same 390 × 844 px capture. Existing SVG home artwork is retained by requirement. React exposes question number, three choices, and accessible image enlargement. |
| Reveal | `docs/design/reviews/ui-001/prototype-reveal-mobile-390.png` | `docs/design/reviews/ui-001/reveal-mobile-390.png` | Same 390 × 844 px capture. Existing approved WebP is used; React makes score breakdown and evidence explanations explicit. |

Focused review used the paired full-view captures above at the same viewport and state. Differences are limited to the required existing scene/character assets and React's explicit progress, scoring, and accessibility controls. No P0/P1/P2 layout or interaction defect remains. Desktop uses the same screen states with a wider multi-column composition, as required; see `reveal-desktop-1440.png` and `result-desktop-1440.png`.

Responsive browser checks covered 320, 375, 390, 430, 768, and 1440 CSS px; all four screens had no horizontal overflow. The reveal portrait sizing and home-scene aspect ratio were adjusted during review to prevent overlap and preserve scene clues. Keyboard dialog close/focus restoration and reduced-motion behavior were also checked in-browser.

## UI-002 visual review

Final result: **passed**. Before/after captures at 390 × 844 and 1440 × 1000 are in `docs/design/reviews/ui-002/{before,after}/`. The play screen hides household titles until reveal; the reveal gives Vera and the score stronger hierarchy. All four screens were checked at 320, 375, 390, 430, 768, and 1440 CSS px with no horizontal overflow. Existing SVG scenes and the approved Vera WebP remain in use.
