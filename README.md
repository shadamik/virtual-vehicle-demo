# Vehicle Lab

An interactive Three.js concept car with five Playwright tests covering paint, lights, rotation, wheel speed, and stopping and restarting the wheels.

## Run locally

```sh
npm ci
npx playwright install chromium
npm start
```

Run `npx playwright test` with port 4173 free. Playwright starts its own server.

## Deploy with Vercel

For a manual preview, run `npx vercel` from this folder and select your Vehicle Lab project. Vercel builds the static files into `dist`.

For automatic delivery, sign in to Vercel and add GitHub under **Account Settings → Authentication → Login Connections**. In the `virtual-vehicle-demo` Vercel project, open **Settings → Git** and connect `shadamik/virtual-vehicle-demo`. If prompted, install the Vercel GitHub app with access to this repository. Use `main` as the production branch. The build command and output directory are already in `vercel.json`.

Push a feature branch and open a pull request. GitHub Actions runs **Vehicle browser tests**, and Vercel supplies a preview URL. These run independently. Merge after the tests pass and you have tried the preview. Vercel builds production from `main`.

To make production promotion wait for the tests on the merged commit, add **Vehicle browser tests** as a GitHub check under **Vercel → Project Settings → Deployment Checks**. Verify the check is configured before relying on it as a release gate. See [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks).

## Verify a deployment

Git deployments show their environment and short commit on the page. Open `/deployment.json` to see the full commit. To run the browser tests against an accessible deployment:

```sh
BASE_URL=https://YOUR-DEPLOYMENT.vercel.app npx playwright test
```

[GitHub Actions test reports](https://github.com/shadamik/virtual-vehicle-demo/actions)
