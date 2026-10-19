# WhoLivesHere? Visual P1 Conditional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task by task. Steps use checkbox (`- [ ]`) syntax. This plan is **not** authorization to integrate candidates.

**Goal:** Add an approved Vera reveal portrait and an approved responsive H01 scene without changing gameplay or breaking GitHub Pages.

**Architecture:** Keep `public/homes/h01.svg` as the image fallback and H02–H05 as they are. Store optional, H01-only visual routes in a small UI asset registry; render desktop/mobile WebP with `<picture>` and render Vera only in the existing revelation. Use the existing Vite `BASE_URL` conversion for every new public asset.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, local WebP/SVG. No new runtime services or dependencies.

**Spec:** `docs/superpowers/specs/2026-10-13-wholiveshere-mvp-design.md`; direction inputs `docs/art-direction/P1/README.md`, `manifest.json`, `ArtBible_v1.1_Vera_Taller.md` and `CODEX_HANDOFF.md`.

## Preconditions and global constraints

- First obtain a clean, text-free Vera master approved against the handoff canon: 2.5 heads, yellow bicycle-pictogram scrunchie, no earrings or glasses, and the other stated identity marks. Obtain a separately approved reveal pose.
- Obtain an approved **fictional** H01 scene and final desktop/mobile WebP exports from it. Resolve the approved MVP spec's “illustrations, not photos” rule with a documented editorial approval before integrating photorealistic output. Do not silently amend the spec.
- The Art Bible v1.1 still says 2.2 heads and a 4:3 master cropped to 4:5; the handoff supersedes the character proportion and describes a vertical 4:5 candidate. Final desktop and mobile framing must be approved separately.
- For H01-Q1, show the bicycle in repair, **pump** and tools; retain the loose-screw stool as the 1-point clue and no repairable lamp. For Q2, retain route map plus mural postcards; for Q3, samples directly beside the map and a small, distinct wall paint test. No readable answer labels, sorted bike parts, or kitchen clues.
- Keep questions, profile text, IDs, points, `src/game/scoring.ts`, `src/game/machine.ts`, and all five SVG files unchanged. Keep the scene visible through the three questions and revelation; show the character only during revelation.
- Use no PNG in `docs/art-direction/P1/candidates/` in runtime. No commits or pushes without authorization.

## File map

| Path | Future responsibility |
| --- | --- |
| `public/homes/h01-desktop.webp`, `public/homes/h01-mobile.webp` | Approved exports; `h01.svg` remains fallback. |
| `public/characters/vera-reveal.webp` | Approved reveal pose, not the annotated reference sheet. |
| `src/ui/visualAssets.ts` | Optional routes and portrait alt for H01 only; no game rules. |
| `src/ui/Scene.tsx`, `src/ui/RevealView.tsx`, `src/App.tsx`, `src/styles.css` | Conditional `<picture>`, reveal portrait and responsive layout. |
| `src/ui/Scene.test.tsx`, `src/App.test.tsx`, `src/ui/visualAssets.test.ts` | Asset, rendering and phase regressions. |

## Review focus

1. A missing or wrong WebP must fail the asset check before release; browsers without WebP support must receive the SVG fallback.
2. A mobile crop must not lose the pump/stool, map/postcards, adjacent samples or small wall test.
3. Vera must not appear during questions or replace the scene in revelation.
4. H02–H05 must continue using their SVGs; all 15 answers and the 30-point maximum must remain unchanged.
5. New sources must resolve below `/WhoLivesHere/` on Pages and below `/` in local development.

## Task 1: Approved asset intake and registry

**Gate:** Do not begin until final files, approvals, SHA256 values, provenance and the spec/editorial decision are supplied. Reject the four current candidates for runtime.

- [ ] **RED:** Add `visualAssets.test.ts` asserting the three agreed public paths exist, have WebP signatures, match the approved hashes, and that desktop/mobile scenes fit the Art Bible budgets (250,000/150,000 bytes). Assert H02–H05 have no alternate visual routes. Run `pnpm.cmd exec vitest run src/ui/visualAssets.test.ts`; expected failure: missing final asset or registry, not test infrastructure.
- [ ] **GREEN:** Copy only approved final WebPs to the file-map paths and add the H01 routes to `visualAssets.ts`. Keep H01 SVG and all current game content intact. Repeat the focused test.
- [ ] **REFACTOR/GATE:** Remove redundant metadata; run `pnpm.cmd run test:run` and `pnpm.cmd run typecheck`. Visually inspect both WebP crops at 390px and 200% zoom against all H01 clues and forbidden objects before Task 2.

## Task 2: Scene and reveal integration

- [ ] **RED:** Extend `Scene.test.tsx` to require H01 `<picture>` desktop/mobile WebP sources under `BASE_URL` plus SVG `<img>` fallback; require H02 SVG only. Extend `App.test.tsx` to require no Vera portrait on H01 questions and a neutral-alt portrait **alongside** the same scene after Q3. Run those two files; expected failure is absent source/portrait behavior.
- [ ] **GREEN:** Add optional H01 visual lookup to `Scene` and `RevealView`, pass H01 identity from `App`, and add scoped responsive CSS. Preserve native buttons, focus behavior and all scores. No new image loader or library.
- [ ] **REFACTOR/GATE:** Keep route joining in one small helper or existing `Scene` convention. Repeat focused tests, full suite, typecheck and build. At 320×568, 390×844, 667×375, 800×600 and desktop verify no horizontal overflow, readable clues, reachable options, visible scene throughout and complete revelation at 200% zoom.

## Task 3: Pages and release verification

- [ ] Build with `pnpm.cmd install --frozen-lockfile`, `pnpm.cmd run test:run`, `pnpm.cmd run typecheck`, `pnpm.cmd run build`. No production edit belongs to this task unless a failing regression test identifies a defect; then return to its owning task and perform RED → GREEN → REFACTOR.
- [ ] Serve the build at `/WhoLivesHere/` with `pnpm.cmd run preview`; GET the HTML, JS, CSS, both new H01 WebPs, the portrait and all five SVGs. Each expected resource must return 200 from the local preview; inspect requests for accidental root paths or remote services.
- [ ] Complete H01–H05 at least once in browser with keyboard and pointer; confirm five revelations, 30/30 for exact answers, restart, H02–H05 visual fallback, and no portrait before H01 revelation. Keep `.github/workflows/deploy.yml` unchanged unless a verified deployment-path failure requires a test-first fix.
- [ ] Record all results and any unverified visual judgement. Do not claim Pages deployed until the committed workflow runs successfully and its public URL is checked; no commit/push is authorized by this plan.

## Handoff

Integration begins only after final visual assets and the editorial/spec gate are approved. Prefer native task-by-task execution because the three increments share a small UI surface and no independent subsystem. The current P1 package is evidence and direction, not release media.
