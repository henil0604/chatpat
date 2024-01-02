import { expect, test } from '@playwright/test';

test('index page has app name', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText(/Chat/)).toBeVisible();
	await expect(page.getByText(/Pat/)).toBeVisible();
});

test('index page has tagline', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText(/Flavor of Privacy/)).toBeVisible();
});

test('index page has pre-register button', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Pre-register' })).toBeVisible();
});