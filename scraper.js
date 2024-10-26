const puppeteer = require('puppeteer');
const fs = require('fs');
const writeDataToCSV = require('./csvWriter'); 

(async () => {
    // Start the browser in headless mode
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.theteflacademy.com/tefl-jobs/advanced-search/?geographic=The+Middle+East&results=1');

    // Function to count job postings on the page
    async function countJobs() {
        return await page.$$eval('h3', elements => elements.length);
    }

    // Function to click the "Load More" button a specified number of times
    async function clickLoadMore(times) {
        for (let i = 0; i < times; i++) {
            let previousJobCount = await countJobs();
            await page.waitForSelector('#is-load-more', { visible: true });
            await page.click('#is-load-more');
            console.log(`Clicked "Load More" ${i + 1} times`);
            await page.waitForFunction(
                previousJobCount => document.querySelectorAll('h3').length > previousJobCount,
                { timeout: 50000 },
                previousJobCount
            );
            await delay(300);  // Small delay after each click to avoid scraping issues
        }
    }

    await clickLoadMore(10);

    const jobLinks = await page.$$eval('h3 a', anchors => 
        anchors.slice(0, 150).map(a => a.href)
    );
    console.log('Number of loaded job links:', jobLinks.length);

    const jobsData = [];

    // Loop through each job link and extract the data
    for (const link of jobLinks) {
        await page.goto(link);
        console.log(`Scraping content from: ${link}`);
        
        // Extract job description
        const description = await page.evaluate(() => {
            const description = document.querySelector('li.item.item--description div.item-description')?.innerText || 'Description not available';
            return { description: description.replace(/\n+/g, ' ').trim() };
        });
    
        // Extract job posting date
        const postDated = await page.evaluate(() => {
            const postDated = document.querySelector('li.item.item--posted div.item-description')?.innerText || 'Date of post not available';
            return { postDated };
        });

        // Extract salary information
        const salary = await page.evaluate(() => {
            const salary = document.querySelector('li.item.item--salary div.item-description')?.innerText || 'Salary not available';
            return { salary };
        });

        // Extract job title
        const jobTitle = await page.evaluate(() => {
            const jobTitle = document.querySelector('h1')?.innerText || 'Job title not available';
            return { jobTitle };
        });

        // Extract job type
        const jobType = await page.evaluate(() => {
            const jobType = document.querySelector('h4.text-decor')?.innerText || 'Job type not available';
            return { jobType };
        });

        // Extract job requirements
        const requirements = await page.evaluate(() => {
            const requirements = document.querySelector('li.item.item--requirements div.item-description')?.innerText || 'Requirements not available';
            return { requirements: requirements.replace(/\n+/g, ' ').trim() };
        });

        // Extract job benefits
        const benefits = await page.evaluate(() => {
            const benefits = document.querySelector('li.item.item--benefits div.item-description')?.innerText || 'Benefits not available';
            return { benefits: benefits.replace(/\n+/g, ' ').trim() };
        });

        // Extract business name
        const businessName = await page.evaluate(() => {
            const businessName = document.querySelector('li.item.item--recruiter div.item-description')?.innerText || 'Business name not available';
            return { businessName };
        });

        // Extract website link (either from 'data-src' or 'href')
        const website = await page.evaluate(() => {
            const websiteElement = document.querySelector('div.singular-job__details__action a.btn.btn--blue');
            return websiteElement 
                ? websiteElement.getAttribute('data-src') || websiteElement.getAttribute('href') || 'Link not available'
                : 'Link not available';
        });
      
        // Extract country and city
        const locationText = await page.evaluate(() => {
            const locationText = document.querySelector('div.singular-job__details__head h3')?.innerText || 'Location not available';
            return locationText;
        });
        const [country, city] = locationText.includes('>') 
            ? locationText.split('>').map(text => text.trim())
            : ['Location not available', ''];
 
        // Add extracted data to jobsData array
        jobsData.push({ link, ...description, ...postDated, ...jobTitle, ...requirements, ...benefits, ...businessName, ...jobType, ...salary, country, city, website });
    }

    // Write data to CSV
    await writeDataToCSV(jobsData, 'jobsData.csv');

    await browser.close();
})();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
