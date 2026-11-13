import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = join(process.cwd(), "out");
const PORT = 4173;
const CHROME = join(
  process.env.LOCALAPPDATA ?? "",
  "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".avif": "image/avif",
  ".webp": "image/webp",
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let file = normalize(join(ROOT, url));
  if (file.endsWith("\\") || file.endsWith("/")) file = join(file, "index.html");
  if (!existsSync(file)) file = join(file, "index.html");
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: "video-raw", size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const wait = (ms) => page.waitForTimeout(ms);

await page.mouse.move(940, 520);
await wait(900);

// Light -> dark
const toggle = page.locator('button[aria-label="Switch to dark theme"]');
const box = await toggle.boundingBox();
if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 24 });
await wait(250);
await toggle.click();
await wait(1300);

// Scroll to work
for (let i = 0; i < 6; i += 1) {
  await page.mouse.wheel(0, 240);
  await wait(130);
}
await wait(900);

const cards = page.locator('[id^="project-"]');
const first = cards.first();
if (await first.count()) {
  await first.hover();
  await wait(1100);
}

// Scroll to writing
for (let i = 0; i < 5; i += 1) {
  await page.mouse.wheel(0, 300);
  await wait(120);
}
await wait(900);

// Command palette
await page.keyboard.press("Control+k");
await wait(450);
await page.keyboard.type("atlas", { delay: 90 });
await wait(1100);
await page.keyboard.press("Escape");
await wait(250);

// Back to hero
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await wait(1200);

await page.mouse.move(1100, 600, { steps: 20 });
await wait(700);

await context.close();
await browser.close();
await new Promise((resolve) => server.close(resolve));

const raw = readdirSync("video-raw").find((name) => name.endsWith(".webm"));
mkdirSync("video", { recursive: true });
execFileSync(
  ffmpegPath,
  [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", join("video-raw", raw),
    "-vf", "setpts=PTS/1.05,fps=30,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=14.2:d=0.8",
    "-t", "15",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-movflags", "+faststart",
    join("video", "portfolio-demo.mp4"),
  ],
  { stdio: "inherit" },
);
unlinkSync(join("video-raw", raw));
console.log("video/portfolio-demo.mp4");
