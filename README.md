# Seedance 2.5 skill for Claude Code and Codex

[中文](README.zh-CN.md)

A skill that lets Claude Code or Codex make videos with Seedance 2.5, ByteDance's video model. Ask for a clip in plain words; the agent writes the prompt, submits the task, waits and saves the mp4. It runs through [HaryAI](https://haryai.com/en/seedance-2-5?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill), where Seedance 2.5 costs 12% less than BytePlus's official price and needs no BytePlus account.

What it can do: text to video, a first frame and a last frame, reference images that keep a character or a product, generated sound, and spoken lines with lip sync. Seedance 2.5 Flash for cheap drafts.

## Install

Claude Code:

```sh
git clone https://github.com/haryai-com/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
```

Codex: the same, into `~/.codex/skills/`.

Then set your key (get it on your [HaryAI account page](https://haryai.com/en/dashboard?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)):

```sh
export HARYAI_KEY=...
```

Node 18 or later. No other dependencies.

## Use

Ask the agent, for example: "Make a 5 second vertical clip of a cat chasing a laser pointer, with sound." It shows the model, length and estimated price and waits for your yes before submitting (a confirmation card in Claude Code), then saves the file to `./out`.

When the look matters, a person or a product, it first makes the opening frame as a still with Nano Banana 2.1 (about $0.0168 an image) and asks you to approve it, so you don't pay for a clip to find out the face is wrong. Several clips can continue one another: each starts from the previous clip's last frame (needs ffmpeg).

The script also works on its own:

```sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "A paper boat sailing down a rain gutter, close up" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "She turns and smiles" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # resume
node ~/.claude/skills/seedance/scripts/seedance.mjs "She turns and smiles" --first frame.jpg --estimate   # price only, nothing submitted
node ~/.claude/skills/seedance/scripts/keyframe.mjs "A woman in a yellow raincoat on a city street, 9:16" --ratio 9:16   # a still for the first frame
```

## Cost

Paid from your HaryAI balance per second of video. Seedance 2.5 at 720p is $0.203 a second; Seedance 2.5 Flash at 480p is $0.059. A failed or moderated task is refunded. Using the skill in Claude Code still runs on your own Claude plan; only the video is paid from HaryAI. All prices: [Seedance API pricing](https://haryai.com/en/seedance-api-pricing?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill).

## Related

- [seedance-2.5-api](https://github.com/haryai-com/seedance-2.5-api): the API itself, curl examples, Q&A
- [seedance-comfyui](https://github.com/haryai-com/seedance-comfyui): the same in ComfyUI (in ComfyUI Manager)
- [n8n-nodes-haryai](https://github.com/haryai-com/n8n-nodes-haryai): the same in n8n (npm `n8n-nodes-haryai`)
- [deepseek-codex-claude-code](https://github.com/haryai-com/deepseek-codex-claude-code): DeepSeek V4 in Codex and Claude Code
- [nano-banana-api](https://github.com/haryai-com/nano-banana-api): Nano Banana 2.1 and 2 through the OpenAI images API or Gemini's own format
- API reference: [docs/video.md](https://haryai.com/docs/video.md)

MIT. Prices as of 2026-11-26.
