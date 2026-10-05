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
const page = await readFile(pagePath, "utf8");
const configTag = '<script src="naver-maps-config.js" defer></script>';
if (!page.includes("<!-- NAVER_MAPS_CONFIG -->")) {
  throw new Error("NAVER Maps configuration placeholder is missing from index.html.");
}
await writeFile(pagePath, page.replace("<!-- NAVER_MAPS_CONFIG -->", configTag));
await writeFile(
  new URL("naver-maps-config.js", outputDirectory),
  `window.NAVER_MAPS_CLIENT_ID = ${JSON.stringify(clientId)};\n`,
);
