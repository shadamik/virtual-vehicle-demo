import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const environments = { production: 'Production', preview: 'Preview' };
const environment = environments[process.env.VERCEL_ENV] ?? 'Local';
const commit = process.env.VERCEL_GIT_COMMIT_SHA;
const sha = /^[a-f0-9]{40}$/.test(commit ?? '') ? commit : 'local';

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const asset of ['index.html', 'app.js', 'vendor']) {
  await cp(asset, `dist/${asset}`, { recursive: true });
}

const html = await readFile('dist/index.html', 'utf8');
const label = `· ${environment} · ${sha.slice(0, 7)}</span>`;
await writeFile('dist/index.html', html.replace('· Local</span>', label));
await writeFile('dist/deployment.json', JSON.stringify({ environment, sha }, null, 2) + '\n');
