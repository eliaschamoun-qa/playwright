// tests/techlistic.spec.js

import { test, expect } from '@playwright/test';
import { TechlisticHomePage } from '../page/TechlisticHomePage';

test.describe('This is a test suite for: Techlistic Website', () => {
  
  test('Test Case T-01: Access Techlistic Website, retrieve and log Selenium dropdown items', async ({ page }) => {
    const techlisticPage = new TechlisticHomePage(page);
    await techlisticPage.goto();
    await expect(page).toHaveURL(techlisticPage.techlisticURL);
    test.setTimeout(20000)
    if(page.url().includes('google')) {
      await techlisticPage.handleAdPopup();
    }
    
    const dropdownItems = await techlisticPage.getSeleniumDropdownItems();
    
    console.log('--- Selenium Dropdown Items ---');
    console.log(dropdownItems);
    console.log('-------------------------------');
    
    expect(dropdownItems.length).toBeGreaterThan(0, 'The dropdown should contain items.');
    expect(dropdownItems.length).toBe(16, 'The Selenium dropdown items should be exactly 16.');
    
    expect(dropdownItems).toContain('Selenium with Java Tutorial');
    expect(dropdownItems).toContain('Selenium with Python Tutorial');
    expect(dropdownItems).toContain('TestNG Integration with Selenium');
    expect(dropdownItems).toContain('Selenium IDE: Complete Tutorial');
    expect(dropdownItems).toContain('* Practice *');
    expect(dropdownItems).toContain('25+ Selenium Commands Cheatsheet');
    expect(dropdownItems).toContain('10 Demo Websites for Practice');
    expect(dropdownItems).toContain('14 Selenium Coding Exercises');
    expect(dropdownItems).toContain('* Advanced Trends *');
    expect(dropdownItems).toContain('AI and ML in Selenium Testing');
    expect(dropdownItems).toContain('(BDD)Selenium and Cucumber Integration');
    expect(dropdownItems).toContain('Automate REST APIs with Selenium');
    expect(dropdownItems).toContain('Perform Visual Testing with Selenium');
    expect(dropdownItems).toContain('Data Driven Testing with Selenium');
    expect(dropdownItems).toContain('All Advanced Selenium Concepts');
    expect(dropdownItems).toContain('View All Blogs');
  });

});