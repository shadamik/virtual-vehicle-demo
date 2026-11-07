# Vehicle Lab — continuous delivery demo

An interactive 3D concept car with real browser tests and a visible GitHub delivery workflow.

[Live vehicle](https://shadamik.github.io/virtual-vehicle-demo/) · [Workflow runs](https://github.com/shadamik/virtual-vehicle-demo/actions)

## The principle

**Commit → push → pull request → tests → preview → merge → tests → production.**

Pull requests test the exact head commit and deploy owner-created, same-repository changes under `preview/pr-N/`. Merging into `main` tests the merged commit and automatically deploys production. Each workflow then checks the live commit marker and repeats the browser tests against the deployed website.

GitHub Pages serves one site: production lives at its root and previews live in subdirectories. Both workflows share a deployment concurrency group and preserve other environments using the `site-state` branch. That branch stores website files only. No external deployment token is required.

## Local use

One-time setup:

```sh
npm ci
npx playwright install chromium
```

Everyday commands:

```sh
npm start
npx playwright test
```

Tests start their own server on port 4173; stop `npm start` before running local tests. To test an existing preview:

```sh
BASE_URL="https://shadamik.github.io/virtual-vehicle-demo/preview/pr-1/" npx playwright test
```

## What is tested

Paint selection, headlights off/on, rotation pause/resume, and wheel-speed feedback. Tests wait for the first rendered frame. They check interactive UI behavior, not pixel-level rendering correctness, vehicle physics, or real telemetry.

The test and live-verification reports are available as GitHub Actions artifacts, including screenshots and traces on failure. A failed pre-deployment test prevents publication. A failed post-deployment test fails the workflow but does not automatically roll back the site.

## Packaging and traceability

`npm run build` copies only `index.html`, `app.js`, and `vendor/` into `dist/`, adds `.nojekyll`, and writes `deployment.json` with the environment and exact source SHA. The visible build label includes the environment and short SHA. CI tests this packaged site before publishing it.

The app remains static and can still be deployed with Vercel. Its original deployment is separate from this repository.

## Dependencies

Three.js 0.170.0 is bundled in `vendor/`, with its MIT license. Car geometry is procedural. A WebGL2-capable browser is required. Node.js 24 is used in CI; dependency versions are pinned in the lockfile.

## Repeating the demonstration

Create a feature branch, make a small UI change and corresponding test, commit, push, and open a pull request. Inspect **Test → Deploy to preview → Verify live vehicle**, try the linked preview, then merge and inspect the matching production workflow. Previews remain available for presentation evidence; there is no automatic cleanup.
