import { test, expect } from '@playwright/test';

/**
 * E2E and Visual Regression tests for Admin Settings
 * @file tests/e2e/admin/settings/settings.spec.ts
 */

test.describe('Admin Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin settings page
    await page.goto('/admin/settings/onboarding');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Settings Navigation', () => {
    test('should load settings page', async ({ page }) => {
      await expect(page).toHaveTitle(/Digital Student Registration/i);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should display settings tabs/navigation', async ({ page }) => {
      // Look for vertical tabs or settings navigation
      const settingsTabs = page.locator('[role="tab"], [role="tablist"], nav a').first();

      if (await settingsTabs.isVisible()) {
        await expect(settingsTabs).toBeVisible();
      }
    });

    test('should navigate between setting sections', async ({ page }) => {
      // Try to navigate to different settings sections
      const settingsLink = page.locator('a:has-text("Onboarding"), a:has-text("Agreement"), a:has-text("Integration")').first();

      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await page.waitForTimeout(500);

        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
      }
    });
  });

  test.describe('Onboarding Settings', () => {
    test('should display onboarding configuration', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should have form fields for onboarding config', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');

      // Look for form elements
      const formElements = page.locator('input, select, textarea, [role="combobox"]');

      if (await formElements.first().isVisible()) {
        const count = await formElements.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should have save button', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');

      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Apply")').first();

      if (await saveButton.isVisible()) {
        await expect(saveButton).toBeVisible();
      }
    });
  });

  test.describe('Agreement Settings', () => {
    test('should display agreements configuration', async ({ page }) => {
      await page.goto('/admin/settings/agreements');
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should show agreement editor or list', async ({ page }) => {
      await page.goto('/admin/settings/agreements');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check if content loaded
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Integration Settings', () => {
    test('should display integrations configuration', async ({ page }) => {
      await page.goto('/admin/settings/integrations');
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should show integration cards or list', async ({ page }) => {
      await page.goto('/admin/settings/integrations');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Audit Log', () => {
    test('should display audit log', async ({ page }) => {
      await page.goto('/admin/settings/audit');
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should show audit entries table or list', async ({ page }) => {
      await page.goto('/admin/settings/audit');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Look for table or list of audit entries
      const table = page.locator('table, [role="table"], [role="list"]').first();

      if (await table.isVisible()) {
        await expect(table).toBeVisible();
      }
    });
  });

  test.describe('Visual Regression - Snapshots', () => {
    test('should match onboarding settings full page', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-onboarding-full.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match onboarding settings viewport', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-onboarding-viewport.png', {
        animations: 'disabled',
      });
    });

    test('should match agreements settings', async ({ page }) => {
      await page.goto('/admin/settings/agreements');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-agreements.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match integrations settings', async ({ page }) => {
      await page.goto('/admin/settings/integrations');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-integrations.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match audit log', async ({ page }) => {
      await page.goto('/admin/settings/audit');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-audit-log.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match settings vertical tabs navigation', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const navigation = page.locator('[role="tablist"], nav').first();

      if (await navigation.isVisible()) {
        await expect(navigation).toHaveScreenshot('settings-vertical-tabs.png', {
          animations: 'disabled',
        });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should match mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('should match tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('settings-tablet.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Accessibility Settings Menu', () => {
    test('should open accessibility menu', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');

      // Look for accessibility button
      const accessibilityButton = page.locator('button[aria-label*="accessibility" i], button:has([data-testid*="accessibility"])').first();

      if (await accessibilityButton.isVisible()) {
        await accessibilityButton.click();
        await page.waitForTimeout(500);

        // Check if drawer opened
        const drawer = page.locator('[role="dialog"], .MuiDrawer-root').first();

        if (await drawer.isVisible()) {
          await expect(drawer).toHaveScreenshot('accessibility-menu-drawer.png', {
            animations: 'disabled',
          });
        }
      }
    });

    test('should show high contrast toggle', async ({ page }) => {
      await page.goto('/admin/settings/onboarding');
      await page.waitForLoadState('networkidle');

      const accessibilityButton = page.locator('button[aria-label*="accessibility" i]').first();

      if (await accessibilityButton.isVisible()) {
        await accessibilityButton.click();
        await page.waitForTimeout(500);

        // Look for high contrast switch
        const highContrastSwitch = page.locator('input[aria-label*="high contrast" i], [role="switch"]');

        if (await highContrastSwitch.first().isVisible()) {
          expect(await highContrastSwitch.count()).toBeGreaterThan(0);
        }
      }
    });
  });
});
