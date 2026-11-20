---
name: seedance
description: Make videos with Seedance 2.5 (ByteDance's video model) through HaryAI. Use when the user asks for a video, a clip, an ad, a short drama scene, an animation, or to turn an image into a video. Text to video, first and last frame, reference images for a consistent character or product, generated sound and spoken lines with lip sync.
---

# Seedance 2.5

`scripts/seedance.mjs` submits a task to Seedance 2.5 through HaryAI (Volcengine Ark format), waits for it and saves the mp4. It needs Node 18 or later and `HARYAI_KEY` in the environment. If the key is missing, tell the user to get one at https://haryai.com and `export HARYAI_KEY=...`; do not ask them to paste it into the chat.

```sh
node <this skill>/scripts/seedance.mjs "<prompt>" [--flash] [--duration 5] [--resolution 720p] [--ratio 16:9] [--audio] [--first img] [--last img] [--ref img] [--out out]
```

## Before running

- Every run costs money from the user's HaryAI balance. The script prints the model, length, size and an approximate price, then waits 3 seconds. Show the user that line.
- For more than one clip, say how many and the total, and wait for a yes.
- Pick the cheapest setting that fits the request: `--flash` and `480p` for tries and drafts, the full model at `720p` or `1080p` for the final cut. Durations are 4 to 30 seconds; default 5.
- Vertical for phones: `--ratio 9:16`.

## Writing the prompt

- Subject, action, setting, camera, light, style, in plain sentences. One clear action per clip.
- Spoken lines go in quotes and need `--audio`; the line is spoken with lip sync.
- Several shots in one clip: number them ("Shot 1: … Shot 2: …"); the model cuts between them and keeps the same character.
- With `--first` (and `--last`), describe only what happens next, not the image itself.
- With `--ref`, say "the woman from the reference image" and write the new scene; face and clothes carry over. Use either frames or references in one task, not both.
- Don't ask the model to write on-screen text; add captions afterwards.

## After running

- The file is saved as `out/<task id>.mp4`. Tell the user the path and open it (`open` on macOS, `xdg-open` on Linux, `start` on Windows).
- A failed task (including moderation) is refunded in full: change the prompt or the image and run again.
- If the script stops after submitting, resume with `node seedance.mjs --task <id>` instead of submitting again.
- The download link lasts 24 hours.

Reference, statuses and errors: https://haryai.com/docs/video.md
