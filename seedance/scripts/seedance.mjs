#!/usr/bin/env node
// Make a video with Seedance 2.5 through HaryAI (Volcengine Ark format):
// submit, poll every 10 s, save the mp4. Node 18 or later, no dependencies.
//
//   node seedance.mjs "<prompt>" [options]
//   node seedance.mjs --task <id>            resume a task that was already submitted
//
// Options:
//   --flash                 Seedance 2.5 Flash (cheaper; 480p and 720p only)
//   --duration <4-30>       seconds, default 5
//   --resolution <480p|720p|1080p>   default 720p
//   --ratio <16:9|9:16|1:1|4:3|3:4|21:9>   default 16:9
//   --audio                 generate sound (speech in quotes is spoken with lip sync)
//   --first <img>           first frame (local file or URL)
//   --last <img>            last frame
//   --ref <img>             reference image, repeatable (keeps a character or product)
//   --out <dir>             default ./out
//   --yes                   skip the price line's 3 second pause
// Key: HARYAI_KEY. API reference: https://haryai.com/docs/video.md

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { extname, join } from "node:path";

const BASE = process.env.HARYAI_BASE_URL || "https://api.haryai.com/api/v3";
const MODELS = { full: "dreamina-seedance-2-5-260628", flash: "dreamina-seedance-2-5-flash-261115" };
const key = process.env.HARYAI_KEY;
if (!key) {
  console.error("HARYAI_KEY is not set. Get a key at https://haryai.com and run: export HARYAI_KEY=...");
  process.exit(1);
}

const o = { duration: 5, resolution: "720p", ratio: "16:9", out: "out", ref: [] };
const words = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--flash" || a === "--audio" || a === "--yes") o[a.slice(2)] = true;
  else if (a === "--ref") o.ref.push(argv[++i]);
  else if (a.startsWith("--")) o[a.slice(2)] = argv[++i];
  else words.push(a);
}
const prompt = words.join(" ");
const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));

// Network hiccups on a GET are retried; the task keeps running on the server.
async function getJSON(url) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      return { res, body: await res.json() };
    } catch (e) {
      if (i >= 30) throw e;
      await sleep(Math.min(5 * (i + 1), 30));
    }
  }
}

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
async function image(src, role) {
  const url = /^(https?|data):/.test(src) ? src : `data:${MIME[extname(src).toLowerCase()] || "image/jpeg"};base64,${(await readFile(src)).toString("base64")}`;
  return { type: "image_url", image_url: { url }, role };
}

// Price per second, read from HaryAI's own price list so it is never stale.
async function pricePerSecond(model, res) {
  try {
    const txt = await (await fetch("https://haryai.com/llms.txt")).text();
    const line = txt.split("\n").find((l) => l.includes(`(${model})`));
    return Number(line.match(new RegExp(`${res} \\$([\\d.]+)`))[1]);
  } catch {
    return null;
  }
}

let id = o.task;
if (!id) {
  if (!prompt) {
    console.error('Usage: node seedance.mjs "<prompt>" [--flash] [--duration 5] [--resolution 720p] [--ratio 16:9] [--audio] [--first img] [--last img] [--ref img]');
    process.exit(1);
  }
  if ((o.first || o.last) && o.ref.length) {
    console.error("Use either --first/--last or --ref, not both in one task.");
    process.exit(1);
  }
  const model = o.flash ? MODELS.flash : MODELS.full;
  const content = [{ type: "text", text: prompt }];
  if (o.first) content.push(await image(o.first, "first_frame"));
  if (o.last) content.push(await image(o.last, "last_frame"));
  for (const r of o.ref) content.push(await image(r, "reference_image"));
  // Always send duration: without it the longest clip is held from the balance.
  const body = { model, content, duration: Number(o.duration), resolution: o.resolution, ratio: o.ratio, generate_audio: !!o.audio };

  const p = await pricePerSecond(model, o.resolution);
  console.log(`${o.flash ? "Seedance 2.5 Flash" : "Seedance 2.5"}, ${o.duration} s, ${o.resolution} ${o.ratio}${p ? `, about $${(p * o.duration).toFixed(2)} (16:9 price)` : ""}`);
  if (!o.yes) await sleep(3);

  const res = await fetch(`${BASE}/contents/generations/tasks`, { method: "POST", headers, body: JSON.stringify(body) });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.id) {
    console.error(`Submit failed (${res.status}): ${JSON.stringify(out)}`);
    process.exit(1);
  }
  id = out.id;
  console.log(`task ${id} submitted. If this stops, resume with: node seedance.mjs --task ${id}`);
}

let task;
for (;;) {
  const { res, body } = await getJSON(`${BASE}/contents/generations/tasks/${id}`);
  if (!res.ok) {
    console.error(`Query failed (${res.status}): ${JSON.stringify(body)}`);
    process.exit(1);
  }
  task = body;
  if (task.status === "succeeded" || task.status === "failed") break;
  process.stdout.write(`${task.status} `);
  await sleep(10);
}
console.log(task.status);
if (task.status === "failed") {
  // Failed, expired and moderated tasks are refunded in full.
  console.error(`failed: ${JSON.stringify(task.error)}. Change the prompt or the image and try again.`);
  process.exit(1);
}

// The link needs no key, redirects to storage and expires after 24 hours.
await mkdir(o.out, { recursive: true });
const file = join(o.out, `${id}.mp4`);
for (let i = 0; ; i++) {
  try {
    const video = await fetch(task.content.video_url);
    if (!video.ok) throw new Error(`HTTP ${video.status}`);
    await pipeline(Readable.fromWeb(video.body), createWriteStream(file));
    break;
  } catch (e) {
    if (i >= 4) throw e;
    await sleep(5);
  }
}
console.log(`saved ${file}`);
