#!/usr/bin/env node
// Make a still image to use as a video's first or last frame, with Nano Banana 2.1
// through HaryAI (OpenAI Images format). A still costs cents; a clip costs much
// more, so settle the look here first. Node 18 or later, no dependencies.
//
//   node keyframe.mjs "<prompt>" [options]
//
// Options:
//   --ratio <16:9|9:16|1:1|4:3|3:4|21:9>   default 16:9 (use the clip's ratio)
//   --size <1K|2K|4K>       default 1K
//   --ref <img>             reference image, repeatable (local file or URL): edit it, or keep its character or product
//   --out <dir>             default ./out
//   --estimate              print the estimated price, then stop
// Key: HARYAI_KEY. API reference: https://haryai.com/docs/image.md

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const BASE = process.env.HARYAI_OPENAI_BASE_URL || "https://api.haryai.com/v1";
const MODEL = "gemini-nano-banana-2.1";
const key = process.env.HARYAI_KEY;
if (!key) {
  console.error("HARYAI_KEY is not set. Get a key at https://haryai.com and run: export HARYAI_KEY=...");
  process.exit(1);
}

const o = { ratio: "16:9", size: "1K", out: "out", ref: [] };
const words = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--estimate") o.estimate = true;
  else if (a === "--ref") o.ref.push(argv[++i]);
  else if (a.startsWith("--")) o[a.slice(2)] = argv[++i];
  else words.push(a);
}
const prompt = words.join(" ");
if (!prompt) {
  console.error('Usage: node keyframe.mjs "<prompt>" [--ratio 16:9] [--size 1K] [--ref img] [--out out] [--estimate]');
  process.exit(1);
}

// Price per image, read from HaryAI's own price list so it is never stale.
async function pricePerImage() {
  try {
    const txt = await (await fetch("https://haryai.com/llms.txt")).text();
    const line = txt.split("\n").find((l) => l.includes(`(${MODEL})`));
    return Number(line.match(new RegExp(`${o.size} \\$([\\d.]+)`))[1]);
  } catch {
    return null;
  }
}

const p = await pricePerImage();
console.log(`Nano Banana 2.1, ${o.size} ${o.ratio}${p ? `, about $${p}` : ""}`);
if (o.estimate) process.exit(0);

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
let res;
if (o.ref.length) {
  // An edit or a reference: multipart, as with OpenAI's /images/edits.
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", prompt);
  form.append("aspect_ratio", o.ratio);
  form.append("image_size", o.size);
  for (const r of o.ref) {
    const buf = /^https?:/.test(r) ? Buffer.from(await (await fetch(r)).arrayBuffer()) : await readFile(r);
    const name = /^https?:/.test(r) ? "ref.png" : basename(r);
    form.append("image", new Blob([buf], { type: MIME[extname(name).toLowerCase()] || "image/png" }), name);
  }
  res = await fetch(`${BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
} else {
  res = await fetch(`${BASE}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, aspect_ratio: o.ratio, image_size: o.size }),
  });
}
const out = await res.json().catch(() => ({}));
const b64 = out?.data?.[0]?.b64_json;
if (!res.ok || !b64) {
  console.error(`Image failed (${res.status}): ${JSON.stringify(out).slice(0, 500)}`);
  process.exit(1);
}
await mkdir(o.out, { recursive: true });
const file = join(o.out, `keyframe-${Date.now()}.png`);
await writeFile(file, Buffer.from(b64, "base64"));
console.log(`saved ${file}`);
