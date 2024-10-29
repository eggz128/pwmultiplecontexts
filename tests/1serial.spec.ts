import { test, expect } from '@playwright/test';

//Establish two contexts from one browser, one context for each person
//Test does something as person 1, then does something as person 2, but each step is performed serially and not in parallel.

test('Two users co-ordinating their actions (not parallel)', async ({ browser }) => {

  const p1 = await browser.newContext(); //Need seperate contexts per 'person'
  const p2 = await browser.newContext();

  const person1 = await p1.newPage(); //And we need to establish a new page in each context
  const person2 = await p2.newPage();

  await person1.goto('https://playwright.dev/');
  await person2.goto('https://google.com/');

  //If person 1 logs in to to the WebDriver2 site, person 2 should not be logged in

  await person1.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await person1.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await person1.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await person1.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await person1.locator('#password').click();
  await person1.locator('#password').fill('edgewords123');
  await person1.getByRole('link', { name: 'Submit' }).click();
  await expect(person1.locator('h1')).toContainText('Add A Record To the Database'); //Person 1 is logged in

  await person2.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/add_record.php'); //Person 2 should be redirected to login page
  await expect(person2.locator('h1')).not.toContainText('Add A Record To the Database');
  

});

