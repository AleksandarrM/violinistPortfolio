import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "assets/violin.glb");
const outDir = resolve(root, "public/models");
const output = resolve(outDir, "violin.glb");
const resized = resolve(outDir, "_violin-512.glb");
const webp = resolve(outDir, "_violin-webp.glb");

mkdirSync(outDir, { recursive: true });

const cli = "npx --no-install gltf-transform";

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", cwd: root });
}

function kb(path) {
  return `${(statSync(path).size / 1024).toFixed(1)} KB`;
}

run(`${cli} resize "${input}" "${resized}" --width 512 --height 512`);
run(`${cli} webp "${resized}" "${webp}"`);

try {
  run(`${cli} draco "${webp}" "${output}"`);
} catch {
  console.warn("Draco step failed — shipping the WebP-compressed model.");
  copyFileSync(webp, output);
}

for (const file of [resized, webp]) {
  try {
    unlinkSync(file);
  } catch {
    // ignore
  }
}

console.log(`\nSource:  ${kb(input)}`);
console.log(`Output:  ${kb(output)}`);
