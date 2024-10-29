import { test, expect } from '@playwright/test';

// Abuse full parallelism to run two "people" in parallel
// when fullyParallel is true in playwright.config.ts (default) test()s in a file can execute in parallel
// To see this in action, on the command line run:
// npx playwright test 2parallel --headed --workers=2 --project=chromium

//Tests have their own context by default, so testA = person 1, testB = person 2

//Beware of race conditions

test.describe('Parallel test execution', () => {
    //test.describe.configure({ mode: 'serial' }); //Force serial execution of these tests even when run with above command line
    test.describe.configure({ retries: 2 });
    test('Person 1', async ({ page }) => {
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
        await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
        await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
        await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
        await page.locator('#password').click();
        await page.locator('#password').fill('edgewords123');
        await page.getByRole('link', { name: 'Submit' }).click();
        await expect(page.locator('h1')).toContainText('Add A Record To the Database'); //Person 1 is logged in
    });

    test('Person 2', async ({ page }) => {
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/add_record.php'); //Person 2 should be redirected to login page
        await expect(page.locator('h1'))
            .not //Comment out to fail
            .toContainText('Add A Record To the Database');
    });
})
