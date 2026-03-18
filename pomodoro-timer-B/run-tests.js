const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const version = process.argv[2] || 'v1';
const suiteArg = process.argv[3] || 'all'; // 'v1', 'v2', 'v3', or 'all'
const htmlPath = path.resolve(__dirname, version, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error(`File not found: ${htmlPath}`);
  process.exit(1);
}

// Extract test suites
function extractTestSuite(specFile, fnName) {
  const content = fs.readFileSync(path.resolve(__dirname, specFile), 'utf-8');
  const matches = [...content.matchAll(/```javascript\n([\s\S]*?)```/g)];
  const target = fnName || 'runAllTests';
  const match = matches.find(m => m[1].includes(target));
  if (!match) {
    console.error(`Could not extract test suite containing "${target}" from ${specFile}`);
    process.exit(1);
  }
  return match[1];
}

const v1TestCode = extractTestSuite('spec.md', 'runAllTests');

const v2SpecPath = path.resolve(__dirname, 'spec-v2.md');
const hasV2 = fs.existsSync(v2SpecPath);
const v2TestCode = hasV2 ? extractTestSuite('spec-v2.md', 'runV2Tests') : null;

const v3SpecPath = path.resolve(__dirname, 'spec-v3.md');
const hasV3 = fs.existsSync(v3SpecPath);
const v3TestCode = hasV3 ? extractTestSuite('spec-v3.md', 'runV3Tests') : null;

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('PASS') || text.includes('FAIL') || text.includes('TEST RESULTS') || text.includes('===')) {
      console.log(text);
    }
  });

  const fileUrl = `file://${htmlPath}`;
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

  let totalPassed = 0, totalFailed = 0, totalCount = 0;

  // Run v1 tests
  if (suiteArg === 'v1' || suiteArg === 'all') {
    await page.evaluate(v1TestCode);
    const v1Results = await page.evaluate(async () => await window.runAllTests());
    totalPassed += v1Results.passed;
    totalFailed += v1Results.failed;
    totalCount += v1Results.total;
  }

  // Run v2 tests
  if ((suiteArg === 'v2' || suiteArg === 'all') && v2TestCode) {
    await page.evaluate(v2TestCode);
    const v2Results = await page.evaluate(async () => await window.runV2Tests());
    totalPassed += v2Results.passed;
    totalFailed += v2Results.failed;
    totalCount += v2Results.total;
  }

  // Run v3 tests
  if ((suiteArg === 'v3' || suiteArg === 'all') && v3TestCode) {
    await page.evaluate(v3TestCode);
    const v3Results = await page.evaluate(async () => await window.runV3Tests());
    totalPassed += v3Results.passed;
    totalFailed += v3Results.failed;
    totalCount += v3Results.total;
  }

  console.log('\n=== OVERALL SUMMARY ===');
  console.log(`Passed: ${totalPassed}/${totalCount}`);
  console.log(`Failed: ${totalFailed}/${totalCount}`);

  if (totalFailed > 0) {
    console.log('\nFailing tests listed above.');
  }

  await browser.close();
  process.exit(totalFailed > 0 ? 1 : 0);
})();
