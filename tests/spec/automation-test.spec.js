// tests/automationexercise.spec.js

import { test, expect } from '@playwright/test';
import { AutomationExerciseHomePage } from '../page/AutomationExerciseHomePage';
import { AutomationExerciseCartPage } from '../page/AutomationExerciseCartPage';
import { AutomationExerciseProductsPage } from '../page/AutomationExerciseProductsPage';

test.describe('Automation Exercise Website Tests', () => {

  const productsToAdd = [
    'Premium Polo T-Shirts',
    'Soft Stretch Jeans',
    'Stylish Dress'
  ];

  let capturedPrices = [];
  test('Test Case AUT-01: Verify user can access the link and assert header elements visiblility and text', async ({ page }) => {
    const automationExerciseHomePage = new AutomationExerciseHomePage(page);
    await automationExerciseHomePage.goto()
    await expect(page).toHaveURL(automationExerciseHomePage.automationURL)
    await automationExerciseHomePage.cartLink.waitFor({ state: 'visible' })
    await expect(automationExerciseHomePage.cartLink).toBeVisible();
    await expect(automationExerciseHomePage.productsLink).toBeVisible();
    await expect(automationExerciseHomePage.cartLink).toHaveText('Cart');
    await expect(automationExerciseHomePage.productsLink).toHaveText(' Products');
  })
  test('Test Case AUT-02: Verify Cart is Empty Initially', async ({ page }) => {
    const automationExerciseHomePage = new AutomationExerciseHomePage(page)
    const automationExerciseCartPage = new AutomationExerciseCartPage(page)
    await automationExerciseHomePage.goto()
    automationExerciseHomePage.cartLink.waitFor({ state: 'visible' })
    await automationExerciseHomePage.viewCart()
    await expect (page).toHaveURL(automationExerciseCartPage.cartPageURL)
    await expect(automationExerciseCartPage.emptyCartMessage).toBeVisible()
    await expect(automationExerciseCartPage.clickHereToBuyProducts).toBeVisible()
    await expect(automationExerciseCartPage.activeShoppingCart).toBeVisible()
    await expect(automationExerciseCartPage.proceedToCheckoutButton).toHaveCount(0)

  })
  test('Test Case AUT-03: Verify the user when added the products they are added correctly and the prices are correctly reflected in the cart', async ({ page }) => {
    const automationExerciseCartPage = new AutomationExerciseCartPage(page)
    const automationExerciseHomePage = new AutomationExerciseHomePage(page)
    await automationExerciseCartPage.goto()
    await automationExerciseCartPage.emptyCartMessage.waitFor({ state: 'visible' })
    await expect(automationExerciseCartPage.emptyCartMessage).toBeVisible()
    await expect(automationExerciseCartPage.clickHereToBuyProducts).toBeVisible()
    await automationExerciseCartPage.clickToBuyProducts()
    await expect(page).toHaveURL('https://automationexercise.com/products')
    const automationExerciseProductsPage = new AutomationExerciseProductsPage(page)
    await expect(automationExerciseProductsPage.searchForProduct).toBeVisible()
    await expect(automationExerciseProductsPage.submitSearch).toBeVisible()
    await expect(page).toHaveURL(automationExerciseProductsPage.productsPageURL)

    const unwantedElementCount = await page.locator('#mys-meta, [title="GoDaddy"]').count();
    if (unwantedElementCount > 0) {
      test.fail(true, "Detected unwanted element, forcing a retry.");
    }
    test.setTimeout(20000); //set timeout to 20 seconds to allow for retries in case ad appears
    for (let i=0; i < productsToAdd.length; i++) {
      await automationExerciseProductsPage.searchProduct(productsToAdd[i])

      const price = await automationExerciseProductsPage.getPriceFromProductCard();

      capturedPrices.push(price);

      console.log(`Captured price for ${productsToAdd[i]}: ${price}`);

      await expect(automationExerciseProductsPage.searchForProduct).toHaveValue(productsToAdd[i])

      await expect(automationExerciseProductsPage.productWrapper).toBeVisible()

      await expect(automationExerciseProductsPage.productWrapper).toHaveCount(1)

      await expect(automationExerciseProductsPage.addToCartButtonBeforeHover).toBeVisible()

      await expect(automationExerciseProductsPage.viewProductButton).toBeVisible()

      await automationExerciseProductsPage.productWrapper.hover()

      await expect(automationExerciseProductsPage.addToCartButtonAfterHover).toBeVisible()

      await automationExerciseProductsPage.addToCartButtonAfterHover.click();
      
      await expect(automationExerciseProductsPage.addedToCartModal).toBeVisible();

      await expect(automationExerciseProductsPage.addedModalTitle).toBeVisible();
      await expect(automationExerciseProductsPage.addedModalMessage).toBeVisible();
      await expect(automationExerciseProductsPage.viewCartLinkInModal).toBeVisible();
      await expect(automationExerciseProductsPage.continueShoppingButton).toBeVisible();
      await automationExerciseProductsPage.validateAndCloseAddedModal();
    }
    // --- Final Price Validation ---
    await automationExerciseHomePage.viewCart()

    await expect (page).toHaveURL(automationExerciseCartPage.cartPageURL)

    await expect(automationExerciseCartPage.proceedToCheckoutButton).toHaveCount(1)

    console.log('All products added. Captured prices:', capturedPrices);

    // // Go to the cart and get the prices displayed there
    const pricesInCart = await automationExerciseCartPage.getPricesFromCart();

    console.log('Prices found in cart:', pricesInCart);

    const namesInCart = await automationExerciseCartPage.getNamesFromCart();

    console.log('Names found in cart:', namesInCart);
    
    expect(capturedPrices.length).toBe(pricesInCart.length);
    expect(pricesInCart.sort()).toEqual(capturedPrices.sort());

    expect(namesInCart.length).toBe(productsToAdd.length);
    expect(namesInCart.sort()).toEqual(productsToAdd.sort());

    const quantitiesInCart = await automationExerciseCartPage.getQuantitiesFromCart();
    console.log('Quantities found in cart:', quantitiesInCart);

    const allQuantitiesAreOne = quantitiesInCart.every(qty => qty === 1)
    expect(allQuantitiesAreOne).toBe(true, 'Expected all product quantities to be 1');
    expect(quantitiesInCart.length).toBe(productsToAdd.length);
    expect(automationExerciseCartPage.closeButton).toHaveCount(3);
    await automationExerciseCartPage.proceedToCheckoutButton.click();
    
    await automationExerciseProductsPage.proceedToCheckoutModal.waitFor({ state: 'visible' });
    await expect(automationExerciseProductsPage.proceedToCheckoutModal).toBeVisible();
    await expect(automationExerciseProductsPage.proceedToCheckoutPostMessage).toBeVisible();
    await expect(automationExerciseProductsPage.loginRegisterLink).toBeVisible();
    await expect(automationExerciseProductsPage.proceedToCheckoutModal).toBeVisible();
    await expect(automationExerciseProductsPage.continueOnCartButton).toBeVisible();
    await automationExerciseProductsPage.continueOnCartButton.click();
    
  })

});