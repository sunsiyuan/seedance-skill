---
name: seedance
description: Make videos with Seedance 2.5 (ByteDance's video model) through HaryAI. Use when the user asks for a video, a clip, an ad, a short drama scene, an animation, or to turn an image into a video. Text to video, first and last frame, reference images for a consistent character or product, generated sound and spoken lines with lip sync.
---

# Seedance 2.5

`scripts/seedance.mjs` submits a task to Seedance 2.5 through HaryAI (Volcengine Ark format), waits for it and saves the mp4. It needs Node 18 or later and `HARYAI_KEY` in the environment. If the key is missing, tell the user to get one at https://haryai.com and `export HARYAI_KEY=...`; do not ask them to paste it into the chat.

```sh
node <this skill>/scripts/seedance.mjs "<prompt>" [--flash] [--duration 5] [--resolution 720p] [--ratio 16:9] [--audio] [--first img] [--last img] [--ref img] [--out out] [--estimate] [--yes]
```

`scripts/keyframe.mjs` makes a still with Nano Banana 2.1 through the same key, for a first or last frame (see Keyframes).

## Before running: estimate, then ask

Every run costs money from the user's HaryAI balance, so nothing is submitted until the user says yes.

1. Run the same command with `--estimate`. It prints the model, length, size and an approximate price, and submits nothing.
2. Ask the user. In Claude Code, use the AskUserQuestion tool: put the estimate line in the question, with the options "Generate", "Draft first with Flash 480p" (when the request isn't already Flash 480p) and "Cancel". Elsewhere, show the line and wait for a yes in text.
3. On "Generate", run the command with `--yes`. On "Draft first", run the Flash 480p version with `--yes`, show it, then ask again before the final cut.
4. For more than one clip, estimate each, ask once with the total.

Pick the cheapest setting that fits the request: `--flash` and `480p` for tries and drafts, the full model at `720p` or `1080p` for the final cut. Durations are 4 to 30 seconds; default 5. Vertical for phones: `--ratio 9:16`.

## Keyframes: settle the look on a still first

A still costs cents and a clip costs much more. When the look matters (a person, a product, a set scene), make the first frame as an image first:

```sh
node <this skill>/scripts/keyframe.mjs "<what the first frame shows>" --ratio 9:16 [--ref img] [--estimate]
```

- Use the clip's ratio. `--ref` keeps a character or product from the user's photo, or edits it.
- Open the image, show it, and ask (AskUserQuestion in Claude Code): "Use this frame", "Try again", "Skip the keyframe". Mention the price from `--estimate` the first time.
- Then run the video with `--first <that image>`, and estimate and ask as above. A last frame works the same way with `--last`.

## Several clips that continue

To make clip 2 start where clip 1 ends, take clip 1's last frame and use it as clip 2's first frame:

```sh
ffmpeg -sseof -0.1 -i out/<clip 1>.mp4 -frames:v 1 -update 1 out/<clip 1>-last.png
```

If ffmpeg isn't installed, tell the user and fall back to a keyframe made with `--ref` from clip 1's still.

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
