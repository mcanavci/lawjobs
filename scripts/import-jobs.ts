import puppeteer, { ElementHandle } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { JobType } from '@prisma/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  type: JobType;
  salary?: string;
  createdAt: string;
  source: string;
  sourceUrl: string;
}

const SEARCH_TERMS = [
  'avukat',
  'lawyer',
  'hukuk müşaviri',
  'hukuki danışman',
  'legal counsel',
  'hukukçu'
];

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeKariyerNet() {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set a proper user agent
  await page.setUserAgent(USER_AGENT);
  
  // Set viewport to a common resolution
  await page.setViewport({ width: 1280, height: 800 });

  const jobs: Job[] = [];

  try {
    // First visit the homepage to get cookies
    await page.goto('https://www.kariyer.net', { waitUntil: 'networkidle0' });
    await delay(2000); // Wait for 2 seconds

    for (const searchTerm of SEARCH_TERMS) {
      console.log(`Searching Kariyer.net for: ${searchTerm}`);
      
      // Use the search URL format
      const searchUrl = `https://www.kariyer.net/is-ilanlari?query=${encodeURIComponent(searchTerm)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle0' });
      await delay(2000);

      // Wait for job listings with multiple possible selectors
      const jobCardSelectors = ['.job-list-item', '.k-card', '.listing-item'];
      let listings: ElementHandle<Element>[] = [];
      
      for (const selector of jobCardSelectors) {
        listings = await page.$$(selector);
        if (listings.length > 0) break;
      }

      console.log(`Found ${listings.length} listings for ${searchTerm}`);

      for (const listing of listings) {
        try {
          // Get the job URL first
          const jobUrl = await listing.$eval('a', (el: HTMLAnchorElement) => el.href);
          console.log(`Processing job URL: ${jobUrl}`);
          
          // Navigate to the job detail page
          await page.goto(jobUrl, { waitUntil: 'networkidle0' });
          await delay(1000);

          // Try multiple possible selectors for each field
          const title = await page.evaluate(() => {
            const selectors = ['.job-title', 'h1', '.listing-title'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const company = await page.evaluate(() => {
            const selectors = ['.company-name', '.employer-name', '.listing-company'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const location = await page.evaluate(() => {
            const selectors = ['.location-name', '.job-location', '.listing-location'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const description = await page.evaluate(() => {
            const selectors = ['.job-detail-content', '.description', '.listing-description'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.innerHTML;
            }
            return '';
          });

          if (!title || !company || !description) {
            console.log('Skipping job due to missing required fields');
            continue;
          }

          jobs.push({
            id: `kn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            company,
            location: location || 'Turkey',
            description,
            requirements: [],
            type: JobType.FULL_TIME,
            createdAt: new Date().toISOString(),
            source: 'Kariyer.net',
            sourceUrl: jobUrl
          });

          console.log(`Scraped job: ${title} at ${company}`);
          await delay(1000); // Wait between job detail pages
        } catch (error) {
          console.error('Error scraping individual Kariyer.net listing:', error);
        }
      }
      
      await delay(2000); // Wait between search terms
    }
  } catch (error) {
    console.error('Error scraping Kariyer.net:', error);
  }

  await browser.close();
  return jobs;
}

async function scrapeLinkedIn() {
  const browser = await puppeteer.launch({ 
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set a proper user agent
  await page.setUserAgent(USER_AGENT);
  
  // Set viewport to a common resolution
  await page.setViewport({ width: 1280, height: 800 });

  const jobs: Job[] = [];

  try {
    // First visit LinkedIn homepage
    await page.goto('https://www.linkedin.com', { waitUntil: 'networkidle0' });
    await delay(2000);

    for (const searchTerm of SEARCH_TERMS) {
      console.log(`Searching LinkedIn for: ${searchTerm}`);
      const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}&location=T%C3%BCrkiye`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle0' });
      await delay(2000);

      // Scroll to load more jobs
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await delay(1000);
      }

      const listings = await page.$$('.job-card-container');
      console.log(`Found ${listings.length} listings for ${searchTerm}`);

      for (const listing of listings) {
        try {
          const jobUrl = await listing.$eval('a', (el: HTMLAnchorElement) => el.href);
          console.log(`Processing LinkedIn job URL: ${jobUrl}`);
          
          await page.goto(jobUrl, { waitUntil: 'networkidle0' });
          await delay(1000);

          const title = await page.evaluate(() => {
            const selectors = ['h1', '.job-title', '.listed-job-posting__title'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const company = await page.evaluate(() => {
            const selectors = ['.jobs-unified-top-card__company-name', '.company-name'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const location = await page.evaluate(() => {
            const selectors = ['.jobs-unified-top-card__bullet', '.job-location'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.textContent?.trim() || '';
            }
            return '';
          });

          const description = await page.evaluate(() => {
            const selectors = ['.jobs-description__content', '.description'];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element) return element.innerHTML;
            }
            return '';
          });

          if (!title || !company || !description) {
            console.log('Skipping LinkedIn job due to missing required fields');
            continue;
          }

          jobs.push({
            id: `li_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            company,
            location: location || 'Turkey',
            description,
            requirements: [],
            type: JobType.FULL_TIME,
            createdAt: new Date().toISOString(),
            source: 'LinkedIn',
            sourceUrl: jobUrl
          });

          console.log(`Scraped job: ${title} at ${company}`);
          await delay(1000);
        } catch (error) {
          console.error('Error scraping individual LinkedIn listing:', error);
        }
      }
      
      await delay(2000);
    }
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
  }

  await browser.close();
  return jobs;
}

async function main() {
  console.log('Starting job import...');
  
  // Read existing jobs
  const jobsPath = path.join(__dirname, '../src/data/jobs.json');
  const existingData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
  
  // Scrape new jobs
  console.log('Scraping Kariyer.net...');
  const kariyerNetJobs = await scrapeKariyerNet();
  console.log(`Found ${kariyerNetJobs.length} jobs from Kariyer.net`);
  
  console.log('Scraping LinkedIn...');
  const linkedInJobs = await scrapeLinkedIn();
  console.log(`Found ${linkedInJobs.length} jobs from LinkedIn`);

  // Combine jobs and remove duplicates based on title and company
  const allJobs = [...existingData.jobs];
  const newJobs = [...kariyerNetJobs, ...linkedInJobs];

  for (const job of newJobs) {
    const isDuplicate = allJobs.some(
      existingJob => 
        existingJob.title.toLowerCase() === job.title.toLowerCase() &&
        existingJob.company.toLowerCase() === job.company.toLowerCase()
    );

    if (!isDuplicate) {
      allJobs.unshift(job); // Add new jobs at the beginning
    }
  }

  // Save updated jobs
  fs.writeFileSync(jobsPath, JSON.stringify({ jobs: allJobs }, null, 2));
  console.log(`Successfully imported ${newJobs.length} new jobs`);
  console.log(`Total jobs in database: ${allJobs.length}`);
}

main().catch(console.error); 