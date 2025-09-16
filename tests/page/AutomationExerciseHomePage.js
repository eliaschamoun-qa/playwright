// tests/pages/automationexercise.page.js

export class AutomationExerciseHomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.automationURL = 'https://automationexercise.com/';
    // locators
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.productsLink = page.getByRole('link', { name: ' Products' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.cartTableRows = page.locator('#cart_info_table tbody tr');
  }

  async goto() {
    await this.page.goto('https://automationexercise.com/');
  }

  
  async viewCart() {
    await this.cartLink.click();
  }
  
  
  async addProductToCart(productName) {
    const productCard = this.page.locator('').fill(productName );
    await productCard.hover();
    
    await productCard.getByText('Add to cart').click();

    await this.continueShoppingButton.waitFor({ state: 'visible' });
    await this.continueShoppingButton.click();
  }

  async getProductsInCart() {
    const productNames = [];
    for (const row of await this.cartTableRows.all()) {
      // Find the product name within each row of the cart table
      const productName = await row.locator('td.cart_description h4 a').textContent();
      if (productName) {
        productNames.push(productName);
      }
    }
    return productNames;
  }
  
}