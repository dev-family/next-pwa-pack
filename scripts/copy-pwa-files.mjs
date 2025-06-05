#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  { name: "Service Worker", src: "sw.js", dest: "sw.js" },
  { name: "Manifest", src: "manifest.json", dest: "manifest.json" },
  { name: "Offline page", src: "offline.html", dest: "offline.html" },
];

const main = async () => {
  const targetDir = "public";
  const projectRoot = path.join(__dirname, "..", "..", "..");
  const publicDir = path.join(projectRoot, targetDir);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log(`[next-pwa-pack] ${targetDir}/ directory created`);
  }

  for (const file of files) {
    const src = path.join(__dirname, "..", file.src);
    const dest = path.join(publicDir, file.dest);
    if (!fs.existsSync(src)) {
      console.error(`[next-pwa-pack] ${file.src} not found:`, src);
      continue;
    }
    if (fs.existsSync(dest)) {
      console.log(`[next-pwa-pack] ${file.dest} already exists in ${targetDir}/. Skipping copy.`);
      continue;
    }
    if (file.src.endsWith(".json")) {
      // For manifest, pretty print
      const data = JSON.parse(fs.readFileSync(src, "utf8"));
      fs.writeFileSync(dest, JSON.stringify(data, null, 2));
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`[next-pwa-pack] ${file.dest} successfully copied to ${targetDir}/${file.dest}`);
  }

  console.log("\n[next-pwa-pack] PWA files copy complete!");
  console.log("Files are always copied to the 'public' directory.");
};

main(); 