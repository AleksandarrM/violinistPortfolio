// Turns assets/violin-key.gif (640px, opaque white background) into a small,
// transparent, gold-tinted animated WebP for the hero scroll cue.
//
// The clef is a single flat colour, so each pixel is `a * clef + (1 - a) * white`
// and the alpha can be recovered exactly instead of guessed with a threshold.
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "assets/violin-key.gif");
const outDir = resolve(root, "public/images");
const output = resolve(outDir, "violin-key.webp");

// Rendered at 40 CSS px; 120px keeps it crisp on 3x displays.
const SIZE = 120;
// Flat colour of the clef in the source GIF.
const SOURCE = [253, 203, 80];
// Design token $gold from styles/_tokens.scss.
const TINT = [0xc9, 0xa6, 0x6b];

mkdirSync(outDir, { recursive: true });

const source = sharp(input, { animated: true });
const { width, pages, delay, loop } = await source.metadata();

// Resize while sharp still knows the frame layout (raw input loses it on
// resize). Resampling is linear, so the white/clef blend below stays exact.
const { data } = await source
  .resize(SIZE, SIZE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  let alpha = 0;
  for (let c = 0; c < 3; c++) {
    const range = 255 - SOURCE[c];
    if (range > 0) alpha = Math.max(alpha, (255 - data[i + c]) / range);
  }
  alpha = Math.min(1, Math.max(0, alpha));
  data[i] = TINT[0];
  data[i + 1] = TINT[1];
  data[i + 2] = TINT[2];
  data[i + 3] = Math.round(alpha * 255);
}

await sharp(data, {
  raw: { width: SIZE, height: SIZE * pages, channels: 4, pageHeight: SIZE },
})
  .webp({ quality: 90, effort: 6, loop: loop ?? 0, delay })
  .toFile(output);

const kb = (path) => `${(statSync(path).size / 1024).toFixed(1)} KB`;
console.log(`${pages} frames, ${width}px -> ${SIZE}px`);
console.log(`${kb(input)} -> ${kb(output)}  (${output})`);
