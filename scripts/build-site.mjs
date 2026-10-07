import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

const clientId = process.env.NAVER_MAPS_CLIENT_ID?.trim();
if (!clientId) {
  throw new Error("NAVER_MAPS_CLIENT_ID is required to build the GitHub Pages site.");
}

const outputDirectory = new URL("../dist/", import.meta.url);
const sourceDirectory = new URL("../", import.meta.url);
await mkdir(outputDirectory, { recursive: true });

for (const file of ["index.html", "styles.css", "script.js", "favicon.svg"]) {
  await cp(new URL(file, sourceDirectory), new URL(file, outputDirectory));
}
await cp(new URL("images/", sourceDirectory), new URL("images/", outputDirectory), { recursive: true });

const pagePath = new URL("index.html", outputDirectory);
let page = await readFile(pagePath, "utf8");
const configTag = '<script src="naver-maps-config.js" defer></script>';
if (!page.includes("<!-- NAVER_MAPS_CONFIG -->")) {
  throw new Error("NAVER Maps configuration placeholder is missing from index.html.");
}
page = page.replace("<!-- NAVER_MAPS_CONFIG -->", configTag);

// GitHub Actions Secrets로부터 계좌 정보 읽어와 치환
const accountReplacements = {
  "{{BRIDE_ACCOUNT_BANK}}": process.env.BRIDE_ACCOUNT_BANK?.trim() || "국민은행",
  "{{BRIDE_ACCOUNT_NUMBER}}": process.env.BRIDE_ACCOUNT_NUMBER?.trim() || "604802-04-0030000",
  "{{BRIDE_FATHER_ACCOUNT_BANK}}": process.env.BRIDE_FATHER_ACCOUNT_BANK?.trim() || "국민은행",
  "{{BRIDE_FATHER_ACCOUNT_NUMBER}}": process.env.BRIDE_FATHER_ACCOUNT_NUMBER?.trim() || "604802-01-00030300",
  "{{GROOM_ACCOUNT_BANK}}": process.env.GROOM_ACCOUNT_BANK?.trim() || "토스뱅크",
  "{{GROOM_ACCOUNT_NUMBER}}": process.env.GROOM_ACCOUNT_NUMBER?.trim() || "1000-0107-8612",
  "{{GROOM_FATHER_ACCOUNT_BANK}}": process.env.GROOM_FATHER_ACCOUNT_BANK?.trim() || "농협",
  "{{GROOM_FATHER_ACCOUNT_NUMBER}}": process.env.GROOM_FATHER_ACCOUNT_NUMBER?.trim() || "333-333-333-3333",
};

for (const [placeholder, value] of Object.entries(accountReplacements)) {
  page = page.replaceAll(placeholder, value);
}

await writeFile(pagePath, page);
await writeFile(
  new URL("naver-maps-config.js", outputDirectory),
  `window.NAVER_MAPS_CLIENT_ID = ${JSON.stringify(clientId)};\n`,
);
