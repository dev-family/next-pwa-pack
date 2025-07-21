// copy-pwa-server-actions.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("[next-pwa-pack] copy-pwa-server-actions.mjs started");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем корень проекта (поднимаемся на 3 уровня вверх от scripts)
const projectRoot = path.join(__dirname, "..", "..", "..");

// Проверяем оба варианта структуры
const srcAppDir = path.join(projectRoot, "src", "app");
const appDir = path.join(projectRoot, "app");

let actionsDir, actionsFile;
if (fs.existsSync(srcAppDir)) {
  actionsDir = srcAppDir;
  actionsFile = path.join(srcAppDir, "actions.ts");
} else {
  actionsDir = appDir;
  actionsFile = path.join(appDir, "actions.ts");
}

const revalidatePWAFunction = `
export async function revalidatePWA(urls: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
  const res = await fetch(\`\${baseUrl}/api/pwa/revalidate\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls,
      secret: process.env.REVALIDATION_SECRET,
    }),
  });
  return res.json();
}
`;

function copyPWAServerActions() {
  if (!fs.existsSync(actionsDir)) {
    fs.mkdirSync(actionsDir, { recursive: true });
  }

  if (!fs.existsSync(actionsFile)) {
    fs.writeFileSync(actionsFile, revalidatePWAFunction.trim() + "\n");
    console.log(`[next-pwa-pack] Created ${actionsFile} with revalidatePWA`);
    return;
  }

  const content = fs.readFileSync(actionsFile, "utf8");
  if (!content.includes("function revalidatePWA")) {
    fs.appendFileSync(actionsFile, "\n" + revalidatePWAFunction.trim() + "\n");
    console.log(`[next-pwa-pack] Added revalidatePWA to ${actionsFile}`);
  } else {
    console.log(
      `[next-pwa-pack] revalidatePWA already exists in ${actionsFile}`
    );
  }
}

copyPWAServerActions();