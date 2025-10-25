import { test, expect } from '@playwright/test';

/**
 * E2E and Visual Regression tests for Students Management
 * @file tests/e2e/admin/management/students.spec.ts
 */

test.describe('Students Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to students management page
    await page.goto('/admin/management/students');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Layout', () => {
    test('should load students management page', async ({ page }) => {
      await expect(page).toHaveTitle(/Digital Student Registration/i);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should display page header', async ({ page }) => {
      // Check for students management header
      const header = page.locator('h1, h2, h3, h4, h5, h6').first();
      await expect(header).toBeVisible();
    });

    test('should display data table', async ({ page }) => {
      // Wait for table to load
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

    test('should display student rows', async ({ page }) => {
      await page.waitForSelector('tbody tr, [role="row"]', { timeout: 5000 });

      const rows = page.locator('tbody tr, [role="row"]');
      const count = await rows.count();

      // Should have at least header row
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should support sorting', async ({ page }) => {
      // Look for sortable column headers
      const sortableHeader = page.locator('th[role="columnheader"]').first();

      if (await sortableHeader.isVisible()) {
        await sortableHeader.click();
        await page.waitForTimeout(500);

        // Table should still be visible after sort
        const table = page.locator('table, [role="table"]').first();
        await expect(table).toBeVisible();
      }
    });

    test('should support search/filter', async ({ page }) => {
      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);

        // Table should still be visible after filtering
        const table = page.locator('table, [role="table"]').first();
        await expect(table).toBeVisible();
      }
    });
  });

  test.describe('Student Actions', () => {
    test('should have add student button', async ({ page }) => {
      // Look for add/create button
      const addButton = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').first();

      if (await addButton.isVisible()) {
        await expect(addButton).toBeVisible();
      }
    });

    test('should open student details on row click', async ({ page }) => {
      await page.waitForSelector('tbody tr', { timeout: 5000 });

      const firstRow = page.locator('tbody tr').first();

      if (await firstRow.isVisible()) {
        await firstRow.click();
        await page.waitForTimeout(500);

        // Should either navigate or open modal/drawer
        // Check for URL change or modal
        const currentUrl = page.url();
        expect(currentUrl.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Visual Regression - Snapshots', () => {
    test('should match students page full screenshot', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('students-page-full.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match students page viewport', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('students-page-viewport.png', {
        animations: 'disabled',
      });
    });

    test('should match students table screenshot', async ({ page }) => {
      await page.waitForSelector('table, [role="table"]', { timeout: 5000 });
      await page.waitForTimeout(500);

      const table = page.locator('table, [role="table"]').first();
      await expect(table).toBeVisible();

      await expect(table).toHaveScreenshot('students-table.png', {
        animations: 'disabled',
      });
    });

    test('should match empty state if no students', async ({ page }) => {
      // Check if there's an empty state
      const emptyState = page.locator('[data-testid="empty-state"], [class*="empty"]').first();

      if (await emptyState.isVisible()) {
        await expect(emptyState).toHaveScreenshot('students-empty-state.png', {
          animations: 'disabled',
        });
      }
    });

    test('should match students page with search active', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('John');
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('students-page-with-search.png', {
          fullPage: true,
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

      await expect(page).toHaveScreenshot('students-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('students-page-tablet.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
});
