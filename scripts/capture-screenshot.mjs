import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const outputFlag = args.findIndex((arg) => arg === "--output");
const output = outputFlag >= 0 && args[outputFlag + 1] ? args[outputFlag + 1] : "artifacts/home.png";
const urlFlag = args.findIndex((arg) => arg === "--url");
const url = urlFlag >= 0 && args[urlFlag + 1] ? args[urlFlag + 1] : `http://127.0.0.1:${process.env.PORT || 3000}`;

await fs.mkdir(path.dirname(output), { recursive: true });

const browser = await puppeteer.launch({ headless: "new" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.screenshot({ path: output, fullPage: true });
  console.log(output);
} finally {
  await browser.close();
}
