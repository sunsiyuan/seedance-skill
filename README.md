# Seedance 2.5 skill for Claude Code and Codex

[中文](README.zh-CN.md)

A skill that lets Claude Code or Codex make videos with Seedance 2.5, ByteDance's video model. Ask for a clip in plain words; the agent writes the prompt, submits the task, waits and saves the mp4. It runs through [HaryAI](https://haryai.com/en/seedance-2-5?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill), where Seedance 2.5 costs 12% less than BytePlus's official price and needs no BytePlus account.

What it can do: text to video, a first frame and a last frame, reference images that keep a character or a product, generated sound, and spoken lines with lip sync. Seedance 2.5 Flash for cheap drafts.

## Install

Claude Code:

```sh
git clone https://github.com/sunsiyuan/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
```

Codex: the same, into `~/.codex/skills/`.

Then set your key (get it on your [HaryAI account page](https://haryai.com/en/dashboard?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)):

```sh
export HARYAI_KEY=...
```

Node 18 or later. No other dependencies.

## Use

Ask the agent, for example: "Make a 5 second vertical clip of a cat chasing a laser pointer, with sound." It shows the model, length and approximate price before submitting, and saves the file to `./out`.

The script also works on its own:

```sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "A paper boat sailing down a rain gutter, close up" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "She turns and smiles" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # resume
```

## Cost

Paid from your HaryAI balance per second of video. Seedance 2.5 at 720p is $0.203 a second; Seedance 2.5 Flash at 480p is $0.059. A failed or moderated task is refunded. Using the skill in Claude Code still runs on your own Claude plan; only the video is paid from HaryAI. All prices: [Seedance API pricing](https://haryai.com/en/seedance-api-pricing?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill).

## Related

- [seedance-2.5-api](https://github.com/sunsiyuan/seedance-2.5-api): the API itself, curl examples, Q&A
- [seedance-comfyui](https://github.com/sunsiyuan/seedance-comfyui): the same in ComfyUI (in ComfyUI Manager)
- [n8n-nodes-haryai](https://github.com/sunsiyuan/n8n-nodes-haryai): the same in n8n (npm `n8n-nodes-haryai`)
- [deepseek-codex-claude-code](https://github.com/sunsiyuan/deepseek-codex-claude-code): DeepSeek V4 in Codex and Claude Code
- [nano-banana-api](https://github.com/sunsiyuan/nano-banana-api): Nano Banana 2.1 and 2 through the OpenAI images API or Gemini's own format
- API reference: [docs/video.md](https://haryai.com/docs/video.md)

MIT. Prices as of 2026-11-22.
