import { test, expect } from '@playwright/test';
import { OurWorldInDataPage } from '../page/OurWorldInDataPage';

test.describe('This is a test suite for website: Our World in Data - Covid Page', () => {
    test.beforeEach(async ({ page }) => {
        const ourWorldInDataPage = new OurWorldInDataPage(page)
        await ourWorldInDataPage.goto()
        await ourWorldInDataPage.dismissCookie()
    });
    test('Test Case OWD-01: Access the Our World Data Website and assert elements visbility and existence', async ({ page }) => {
        const ourWorldInDataPage = new OurWorldInDataPage(page)
        await expect(page.url()).toBe(ourWorldInDataPage.pageURL)
        await ourWorldInDataPage.byCountryLink.waitFor({ state: 'visible' })
        await expect(ourWorldInDataPage.byCountryLink).toBeVisible()
        await expect(ourWorldInDataPage.dataExplorerLink).toBeVisible()
        await expect(ourWorldInDataPage.deathsLink).toBeVisible()
        await expect(ourWorldInDataPage.casesLink).toBeVisible()
        await expect(ourWorldInDataPage.testsLink).toBeVisible()
        await expect(ourWorldInDataPage.vaccinationsLink).toBeVisible()
        await expect(ourWorldInDataPage.mortalityRiskLink).toBeVisible()
        await expect(ourWorldInDataPage.excessMortalityLink).toBeVisible()
        await expect(ourWorldInDataPage.policyResponsesLink).toBeVisible()
        
        await expect(ourWorldInDataPage.browseByTopicButton).toBeVisible()
        
        const listItem = ourWorldInDataPage.dataExplorerLink.locator('..')
        await expect(listItem).toHaveClass('current highlight');

    })

    test('Test Case OWD-02: Verify user can nselect all default countries, search by United Kingdom, and select UK. Then get the tooltip data', async ({ page }) => {
        const ourWorldInDataPage = new OurWorldInDataPage(page);
        await expect(page.url()).toBe(ourWorldInDataPage.pageURL)
        await ourWorldInDataPage.lineChartTab.waitFor({ state: 'visible' })
        await expect(ourWorldInDataPage.lineChartTab).toBeVisible()
        await expect(ourWorldInDataPage.lineChartTab).toBeEnabled()
        await expect(ourWorldInDataPage.searchForCountryInput).toBeVisible()

        await ourWorldInDataPage.lineChartTab.click();
        await expect (page.url()).toContain('covid?tab=line&Metric=Excess+mortality')

        const selectedLabels = ourWorldInDataPage.selectedCountries;

        console.log(`Initial selected count: ${await selectedLabels.count()}`);

        await selectedLabels.first().click({ force: true });

        while (await selectedLabels.count() > 0) {
            const currentCount = await selectedLabels.count();
            console.log(`Unselecting country. Remaining count: ${currentCount}`);

            await selectedLabels.first().click({ force: true });
            await expect(selectedLabels).toHaveCount(currentCount - 1);
        }

        await expect(selectedLabels).toHaveCount(0);
        console.log('All countries unselected successfully.');
        await ourWorldInDataPage.searchForCountry('United Kingdom')
        const legendLabelsSelector = 'g#text-labels text';

        // Wait for the labels to be present in the DOM
        await page.waitForSelector(legendLabelsSelector);

        // Retrieve all the label elements
        const labelLocators = await page.locator(legendLabelsSelector).all();

        console.log('--- Chart Legend Tooltip Info ---');
        
        for (const label of labelLocators) {
            const textContent = await label.textContent();
            // Clean up the text by replacing multiple spaces/newlines with a single space
            const cleanedText = textContent?.replace(/\s+/g, ' ').trim();
            if (cleanedText) {
                console.log(cleanedText);
            }
        }
        console.log('---------------------------------');
        
        const chart = page.locator('g.Lines > rect');
        const chartBox = await chart.boundingBox();

        if (!chartBox) {
            throw new Error("Could not find the chart's bounding box.");
        }

        let lastTooltipText = '';

        console.log('--- Scraping Tooltip Data ---');

        for (let x = 5; x < chartBox.width; x += 15) {

            console.log(`United Kindgom Confirmed COVID-19 deaths (per 100k): ${x} of ${chartBox.width.toFixed(0)}`);

            await chart.hover({ position: { x: x, y: chartBox.height / 2 } });

            const tooltip = page.locator('.grapher-tooltip');

            if (await tooltip.isVisible()) {
                const currentTooltipText = await tooltip.textContent();

                if (currentTooltipText && currentTooltipText.trim() !== lastTooltipText) {
                    const cleanedText = currentTooltipText.replace(/\s+/g, ' ').trim();
                    // This will now print the data point found at the current step
                    console.log(`  -> Found data: ${cleanedText}`);
                    lastTooltipText = cleanedText;
                }
            }
        }
        console.log('--- Finished Scraping ---');
    });

})