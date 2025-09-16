export class TechlisticHomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.techlisticURL = 'https://www.techlistic.com/'
    // Locators for the elements we need to interact with
    this.adDismissButton = page.locator('#dismiss-button');
    this.seleniumMenu = this.seleniumMenu = page.getByRole('navigation').getByRole('link', { name: 'Selenium' })
    this.seleniumDropdownItems = this.seleniumMenu.locator('~ .dropdown-content a'); // Using relative locator to find sibling
  }

  async goto() {
    await this.page.goto(this.techlisticURL);
  }

  async handleAdPopup() {
    try {
      await this.adDismissButton.click({ timeout: 5000 });
      console.log('Ad dismissed.');
    } catch (error) {
      console.log('Ad pop-up was not present.');
    }
  }

  /**
   * Hovers over the Selenium menu and returns the text content of its dropdown items.
   * @returns {Promise<string[]>} An array of strings containing the dropdown item text.
   */
  async getSeleniumDropdownItems() {
    await this.seleniumMenu.hover();
    
    await this.seleniumDropdownItems.first().waitFor({ state: 'visible' });
    
    const dropdownItems = await this.seleniumDropdownItems.allTextContents();
    
    return dropdownItems.map(item => item.trim());
  }
}