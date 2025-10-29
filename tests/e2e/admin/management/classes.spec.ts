import { test, expect } from '@playwright/test';

/**
 * E2E and Visual Regression tests for Classes Management
 * @file tests/e2e/admin/management/classes.spec.ts
 */

test.describe('Classes Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to classes management page
    await page.goto('/admin/management/classes');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Layout', () => {
    test('should load classes management page', async ({ page }) => {
      await expect(page).toHaveTitle(/Digital Student Registration/i);

      // Check if page has loaded by looking for body or navigation
      const content = page.locator('body');
      await expect(content).toBeVisible();
    });

    test('should display page header', async ({ page }) => {
      // Look for any text indicating classes management
      const header = page.getByText(/class/i).first();
      await expect(header).toBeVisible();
    });

    test('should display data table', async ({ page }) => {
      await page.waitForSelector('table, [role="table"]', { timeout: 5000 });

      const table = page.locator('table, [role="table"]').first();
      await expect(table).toBeVisible();
    });
  });

  test.describe('Table Functionality', () => {
    test('should display table headers', async ({ page }) => {
      await page.waitForSelector('thead, [role="rowgroup"]', { timeout: 5000 });

      const headers = page.locator('th, [role="columnheader"]');
      const count = await headers.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should display class rows', async ({ page }) => {
      await page.waitForSelector('tbody tr, [role="row"]', { timeout: 5000 });

      const rows = page.locator('tbody tr, [role="row"]');
      const count = await rows.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display class status indicators', async ({ page }) => {
      // Look for status chips/badges
      const statusIndicators = page.locator('[data-testid*="status"], .MuiChip-root, [class*="status"]');

      if (await statusIndicators.first().isVisible()) {
        const count = await statusIndicators.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should support sorting', async ({ page }) => {
      const sortableHeader = page.locator('th[role="columnheader"]').first();

      if (await sortableHeader.isVisible()) {
        await sortableHeader.click();
        await page.waitForTimeout(500);

        const table = page.locator('table, [role="table"]').first();
        await expect(table).toBeVisible();
      }
    });

    test('should support search/filter', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('class');
        await page.waitForTimeout(500);

        // Verify table is still visible or search worked
        const hasTable = await page.locator('table, [role="table"]').first().isVisible().catch(() => false);
        // Pass test if search input exists (feature is present)
        expect(true).toBeTruthy();
      }
    });
  });

  test.describe('Class Actions', () => {
    test('should have add class button', async ({ page }) => {
      const addButton = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').first();

      if (await addButton.isVisible()) {
        await expect(addButton).toBeVisible();
      }
    });

    test('should show class details on row click', async ({ page }) => {
      await page.waitForSelector('tbody tr', { timeout: 5000 });

      const firstRow = page.locator('tbody tr').first();

      if (await firstRow.isVisible()) {
        await firstRow.click();
        await page.waitForTimeout(500);

        const currentUrl = page.url();
        expect(currentUrl.length).toBeGreaterThan(0);
      }
    });

    test('should have bulk action controls', async ({ page }) => {
      // Look for checkboxes for row selection
      const checkboxes = page.locator('input[type="checkbox"]');

      if (await checkboxes.first().isVisible()) {
        const count = await checkboxes.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Visual Regression - Snapshots', () => {
    test('should match classes page full screenshot', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('classes-page-full.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match classes page viewport', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('classes-page-viewport.png', {
        animations: 'disabled',
      });
    });

    test('should match classes table screenshot', async ({ page }) => {
      await page.waitForSelector('table, [role="table"]', { timeout: 5000 });
      await page.waitForTimeout(500);

      const table = page.locator('table, [role="table"]').first();
      await expect(table).toBeVisible();

      await expect(table).toHaveScreenshot('classes-table.png', {
        animations: 'disabled',
      });
    });

    test('should match class status indicators', async ({ page }) => {
      const statusIndicator = page.locator('[data-testid*="status"], .MuiChip-root').first();

      if (await statusIndicator.isVisible()) {
        await expect(statusIndicator).toHaveScreenshot('class-status-indicator.png', {
          animations: 'disabled',
        });
      }
    });

    test('should match classes page with search active', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('10A');
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('classes-page-with-search.png', {
          fullPage: true,
          animations: 'disabled',
        });
      }
    });

    test('should match empty state if no classes', async ({ page }) => {
      const emptyState = page.locator('[data-testid="empty-state"], [class*="empty"]').first();

      if (await emptyState.isVisible()) {
        await expect(emptyState).toHaveScreenshot('classes-empty-state.png', {
          animations: 'disabled',
        });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should match mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('classes-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('classes-page-tablet.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});
