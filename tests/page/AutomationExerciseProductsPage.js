export class AutomationExerciseProductsPage {
    /**
     * @param {import('@playwright/test').Page} page
     * /
     **/
    constructor(page) {
        this.page = page;
        this.productsPageURL = 'https://automationexercise.com/products';
        // locators
        this.searchForProduct = page.locator('#search_product');
        this.submitSearch = page.locator('#submit_search');
        this.productWrapper = page.locator('.product-image-wrapper');
        this.productPrice = this.productWrapper.locator('.productinfo h2');
        this.viewProductButton = page.locator('div.choose a', { hasText: 'View Product' });
        this.addToCartButtonBeforeHover = page.locator('div.productinfo.text-center > a', { hasText: 'Add to cart' });
        this.addToCartButtonAfterHover = page.locator('div.product-overlay a', { hasText: 'Add to cart' });
        this.addedToCartModal = page.locator('.modal-content');
        this.addedModalTitle = this.addedToCartModal.getByRole('heading', { name: 'Added!' });
        this.addedModalMessage = this.addedToCartModal.getByText('Your product has been added to cart.');
        this.viewCartLinkInModal = this.addedToCartModal.getByRole('link', { name: 'View Cart' });
        this.continueShoppingButton = this.addedToCartModal.getByRole('button', { name: 'Continue Shopping' });

        this.proceedToCheckoutModal = page.locator('.modal-content');
        this.proceedToCheckoutPostMessage = this.proceedToCheckoutModal.getByText('Register / Login account to proceed on checkout.');
        this.loginRegisterLink = this.proceedToCheckoutModal.getByRole('link', 'Register / Login');
        this.continueOnCartButton = this.proceedToCheckoutModal.getByRole('button', { name: 'Continue On Cart' });


    }
    async goto() {
        await this.page.goto(this.productsPageURL);
    }
    async searchProduct(productName) {
        await this.searchForProduct.fill(productName);
        await this.submitSearch.click();
    }
    
    async validateAndCloseAddedModal() {
        await this.continueShoppingButton.click();
    }
    async getPriceFromProductCard() {
        const priceText = await this.productPrice.textContent(); // Gets text like "Rs. 1500"
        
        return priceText;
    }
    
}