# World Cup 2026 — Bracket Predictor 🏆

An interactive bracket predictor for the **2026 FIFA World Cup** (11 Jun – 19 Jul 2026,
hosted by Canada, Mexico & the USA). Set each group's standings, advance the eight
best third-placed teams under FIFA's real rules, and pick your way to a champion —
with team kits, full squads, pre-tournament form, and fixtures shown in the time zone
you choose (defaults to your own local time, with TRT and many others available).

## Features

- **Bracket predictor** — drag to reorder all 12 groups (mouse, touch or
  keyboard), choose the 8 best third-placed qualifiers, and click through
  Round of 32 → Final. Picks persist in your browser.
- **Share & score** — once you crown a champion, share buttons appear on the
  *predicted champion* banner (and in a one-time celebration pop-up): copy a link,
  post to X, or **save your bracket as an image**. The link encodes your whole
  prediction in the URL (no backend); opening a shared link previews that bracket
  without touching your own. The saved image is drawn on a canvas as the full
  knockout tree (Round of 32 → Final, plus the third-place play-off) with flags,
  highlighted winners and your champion. A **scorecard** is always available and
  grades your prediction against real results — group winners, qualifiers and each
  knockout round, weighted toward the final — showing 0 until the tournament starts.
- **Accurate knockout rules** — Round-of-32 pairings and the *allowed groups* for
  each best-third-placed slot follow FIFA's published structure (Annex C).
- **Hover cards** — hover any team for a quick summary: home/away kits, recent form
  (most recent results first), and a link to its **live starting XI** on
  [mylineups.app](https://mylineups.app/world-cup-2026/).
- **Team pages** — full World Cup squad (with shirt numbers, clubs & captain),
  head coach, kits, *form before the World Cup*, and group fixtures.
- **Time-zone selector** — pick any zone from the header; the choice is remembered.
  Defaults to your browser's local time, and Türkiye (TRT, UTC+3) is one click away.
- **Calendar** — all 104 fixtures grouped by day, filterable by stage, with kickoff
  times shown in your selected time zone.
- **Live results mode** — flip the **Live results** switch on the bracket to order
  every group by real World Cup points (your prediction breaks ties for undecided
  spots, so the knockout stays yours to pick). In Live mode the hover cards show a
  team's actual World Cup matches, and team pages show real scores on group fixtures
  as soon as they're played. Results come from a small JSON snapshot refreshed by a
  scheduled GitHub Action — no API key or backend required.

## Data & accuracy

- **Groups, schedule, venues, knockout structure** are verified from the official
  draw (5 Dec 2025) and FIFA's match schedule.
- **Kits** are rendered as colour-accurate SVG jerseys (no copyrighted imagery), with
  per-team colours and patterns in [`data/kits.ts`](data/kits.ts). **Flags** use
  [flagcdn.com](https://flagcdn.com) with an emoji fallback.
- **Squads** are complete for all 48 teams — 26 players each (shirt number, position,
  club, captain) in [`data/squads.ts`](data/squads.ts), with headshots hot-linked from
  mylineups.app and a number badge fallback. Every team also links to its always-current
  starting XI there.
- **Pre-tournament form** for all 48 teams lives in [`data/recentForm.ts`](data/recentForm.ts)
  (last ~5 internationals each, scored from the team's perspective). See
  [`docs/DATA_PIPELINE.md`](docs/DATA_PIPELINE.md) for how the squad and form data were
  sourced and how to refresh it.
- **Live results** are fetched from [TheSportsDB](https://www.thesportsdb.com) (free
  public key) by [`scripts/fetchLiveResults.mjs`](scripts/fetchLiveResults.mjs), which
  writes a compact [`public/liveResults.json`](public/liveResults.json). A scheduled
  GitHub Action ([`.github/workflows/live-results.yml`](.github/workflows/live-results.yml))
  re-runs it and commits the updated JSON to `gh-pages`, so the static site shows fresh
  scores with no server or secret. **For near-real-time updates**, an open tab also polls
  TheSportsDB directly for *today's* matches every ~60s ([`utils/liveSource.ts`](utils/liveSource.ts))
  and merges those scores over the committed baseline — falling back silently to the
  snapshot if the request fails or is rate-limited. Live standings are computed only from
  **finished** matches; in-progress scores are shown but never counted until full time.
- **Best-third-placed slotting is FIFA-exact.** All 495 combinations from the
  FIFA regulations' Annex C are encoded in [`data/thirdPlaceTable.ts`](data/thirdPlaceTable.ts);
  when 8 thirds are chosen the Round of 32 is filled straight from that table, so
  the matchups are identical to FIFA's. A constraint solver in
  [`utils/thirdPlace.ts`](utils/thirdPlace.ts) remains only as a safety fallback.
  Run `npm run validate:table` to verify the table has all 495 unique
  combinations with every per-slot constraint satisfied.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000/world-cup-2026/
npm run build    # production build to dist/
npm run deploy   # build + publish dist/ to the gh-pages branch
```

Deployed as a GitHub Pages project site, so `vite.config.ts` sets
`base: '/world-cup-2026/'` and the app uses a `HashRouter` (no server rewrites needed).

## Project structure

```
data/      teams, groups, venues, 104-match schedule, Annex C third-place table,
           kits, full 48-team squads, pre-tournament form
utils/     time-zone formatting, third-place solver, bracket resolution, live table,
           share-code (URL encode/decode), prediction scoring
components/ Jersey, Flag, hover card, group cards, knockout bracket, match cards,
           share/score UI (canvas bracket image, scorecard, winner pop-up),
           settings + live stores
pages/     Bracket, Teams, Team detail, Calendar
scripts/   validateTable.mjs (Annex C check), fetchLiveResults.mjs (live snapshot)
public/    liveResults.json — live results snapshot read by the app at runtime
docs/      DATA_PIPELINE.md — how squad & form data is sourced and refreshed
.github/   workflows/live-results.yml — scheduled live-results refresh
```

An independent fan project — not affiliated with FIFA.
