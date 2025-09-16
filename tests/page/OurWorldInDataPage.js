export class OurWorldInDataPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        this.pageURL = 'https://ourworldindata.org/explorers/covid'
        // locators
        this.browseByTopicButton = page.locator('[aria-label="Toggle topics menu"]')
        this.dataLink = page.getByRole('link', { name: 'Data' })
        this.insightsLink = page.getByRole('link', { name: 'Insights' })
        this.resourcesButton = page.getByRole('button', { name: 'Resources' })
        this.aboutButton = page.getByRole('button', { name: 'About' })

        this.byCountryLink = page.getByRole('link', { name: 'By country' })
        this.dataExplorerLink = page.getByRole('link', { name: 'Data explorer' })
        this.deathsLink = page.getByRole('link', { name: 'Deaths' })
        this.casesLink = page.getByRole('link', { name: 'Cases' })
        this.testsLink = page.getByRole('link', { name: 'Tests' })
        this.vaccinationsLink = page.getByRole('link', { name: 'Vaccinations' })
        this.mortalityRiskLink = page.getByRole('link', { name: 'Mortality risk' })
        this.excessMortalityLink = page.getByRole('link', { name: 'Excess mortality' })
        this.policyResponsesLink = page.getByRole('link', { name: 'Policy responses' })
        this.selectedCountries = page.locator('label.selected input[type="checkbox"]');
        this.lineChartTab = page.locator('[data-track-note="chart_click_LineChart"]')
        this.searchForCountryInput = page.locator('[data-track-note="entity_picker_search_input"]')

        


    }
    async goto() {
        await this.page.goto('https://ourworldindata.org/explorers/covid')
    }
    async dismissCookie() {
        const cookieBanner = this.page.locator('[data-track-note="cookie_notice"]').first();

        // 1. First, check if the banner exists to avoid errors when it doesn't
        if (await cookieBanner.isVisible()) {
            console.log('Cookie consent banner found. Scrolling and clicking.');

            // 2. Explicitly scroll the element into the visible area
            await cookieBanner.scrollIntoViewIfNeeded();

            // 3. Perform a regular, safe click. Playwright will auto-wait for it to be ready.
            await cookieBanner.click();
        } else {
            console.log('Cookie consent banner was not present.');
        }
    }
    async searchForCountry(country){
        this.searchForCountryInput.fill(country)
        this.page.getByText(country, { exact: true }).click()
    }
}