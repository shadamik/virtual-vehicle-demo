const { test, expect } = require('@playwright/test');

// Wait for the first rendered frame, not just the static HTML.
test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#view')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#error')).toBeHidden();
});

test('paint selection updates its name and selected swatch', async ({ page }) => {
  await expect(page.locator('#paint-name')).toHaveText('Sage');
  await page.getByRole('button', { name: 'Blue paint', exact: true }).click();
  await expect(page.locator('#paint-name')).toHaveText('Blue');
  await expect(page.getByRole('button', { name: 'Blue paint', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Sage paint', exact: true }))
    .toHaveAttribute('aria-pressed', 'false');
});

test('headlights switch off and back on', async ({ page }) => {
  const status = page.locator('#light-state');
  await expect(status).toHaveText('Headlights on');
  await page.getByRole('button', { name: 'Headlights: on', exact: true }).click();
  await expect(status).toHaveText('Headlights off');
  await expect(page.locator('#lights')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Headlights: off', exact: true }).click();
  await expect(status).toHaveText('Headlights on');
  await expect(page.locator('#lights')).toHaveAttribute('aria-pressed', 'true');
});

test('automatic rotation can be paused and resumed', async ({ page }) => {
  await page.getByRole('button', { name: 'Pause rotation', exact: true }).click();
  await expect(page.locator('#rotate')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Resume rotation', exact: true }).click();
  await expect(page.locator('#rotate')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#rotate')).toHaveText('Pause rotation');
});

test('wheel-speed feedback follows keyboard input and resets', async ({ page }) => {
  const speed = page.getByRole('slider', { name: 'Wheel speed' });
  await expect(page.locator('#speed-value')).toHaveText('0 km/h');
  await speed.press('ArrowRight');
  await expect(speed).toHaveValue('10');
  await expect(page.locator('#speed-value')).toHaveText('10 km/h');
  await speed.press('Home');
  await expect(speed).toHaveValue('0');
  await expect(page.locator('#speed-value')).toHaveText('0 km/h');
});

test('Stop wheels resets moving wheels and allows restarting', async ({ page }) => {
  const speed = page.getByRole('slider', { name: 'Wheel speed' });
  await speed.press('End');
  await expect(speed).toHaveValue('120');
  await expect(page.locator('#speed-value')).toHaveText('120 km/h');
  await page.getByRole('button', { name: 'Stop wheels', exact: true }).click();
  await expect(speed).toHaveValue('0');
  await expect(page.locator('#speed-value')).toHaveText('0 km/h');
  await speed.press('ArrowRight');
  await expect(speed).toHaveValue('10');
  await expect(page.locator('#speed-value')).toHaveText('10 km/h');
});
