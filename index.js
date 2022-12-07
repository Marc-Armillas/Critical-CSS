const puppeteer = require('puppeteer')
const URL = process.env.URL || ''

;(async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  await page.coverage.startCSSCoverage()
  await page.goto(URL, {waitUntil: 'domcontentloaded'});

  const cssCoverage = await page.coverage.stopCSSCoverage({waitUntil: 'domcontentloaded'})

  let criticalCSS = ''
  for (const entry of cssCoverage) {
    for (const range of entry.ranges) {
      criticalCSS += entry.text.slice(range.start, range.end)
    }
  }

  const userAgent = await page.evaluate(() => navigator.userAgent);
  // console.log(userAgent);
  
  console.log(criticalCSS)

  await page.close()
  await browser.close()
})()