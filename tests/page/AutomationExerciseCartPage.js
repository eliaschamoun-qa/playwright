export class AutomationExerciseCartPage {
    /**
     * @param {import('@playwright/test').Page} page
     * /
    **/  
    constructor(page) {
        this.page = page;
        this.cartPageURL = 'https://automationexercise.com/view_cart';
        // locators
        this.emptyCartMessage = page.getByText('Cart is empty');
        this.clickHereToBuyProducts = page.getByText('Click here to buy products');
        this.activeShoppingCart = page.locator('li.active:has-text("Shopping Cart")');
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartTable = page.locator('#cart_info_table');
        this.closeButton = page.locator('.cart_quantity_delete');
        
    }
    async goto() {
        await this.page.goto(this.cartPageURL);
    }
    async clickToBuyProducts() {
        await this.clickHereToBuyProducts.click();
    }
    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
    async getPricesFromCart() {

        if (! (await this.cartTable.isVisible())) {
            await this.page.getByRole('link', { name: ' Cart' }).click();
        }
        
        const priceLocators = this.cartTable.locator('td.cart_price p');
        
        const priceTexts = await priceLocators.allTextContents();
        
        return priceTexts;
    }
    async getNamesFromCart() {
        if (! (await this.cartTable.isVisible())) {
            await this.page.getByRole('link', { name: ' Cart' }).click();
        }
        const nameTexts = this.cartTable.locator('td.cart_description h4 a').allTextContents();
        
        return nameTexts;
    }
    async getQuantitiesFromCart() {
        if (! (await this.cartTable.isVisible())) {
            await this.page.getByRole('link', { name: ' Cart' }).click();
        }
        
        const quantityLocators = this.cartTable.locator('td.cart_quantity button');
        
        const quantityTexts = await quantityLocators.allTextContents();

        return quantityTexts.map(qty => parseInt(qty, 10));
    }
}   
