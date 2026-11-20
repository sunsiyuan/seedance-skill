#!/usr/bin/env node
// Writes README.md and README.zh-CN.md. The discount and per-second prices are
// read from https://haryai.com/llms.txt, so nothing here is typed twice.

import { writeFile } from "node:fs/promises";

const llms = await (await fetch("https://haryai.com/llms.txt")).text();
const share = Number(llms.match(/at (\d+)% of BytePlus's official price/)[1]);
const sec = (model, res) => llms.split("\n").find((l) => l.includes(`(${model})`)).match(new RegExp(`${res} \\$([\\d.]+)`))[1];
const full720 = sec("dreamina-seedance-2-5-260628", "720p");
const flash480 = sec("dreamina-seedance-2-5-flash-261115", "480p");
const utm = (path) => `https://haryai.com${path}?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill`;
const today = new Date().toISOString().slice(0, 10);

const en = `# Seedance 2.5 skill for Claude Code and Codex

[中文](README.zh-CN.md)

A skill that lets Claude Code or Codex make videos with Seedance 2.5, ByteDance's video model. Ask for a clip in plain words; the agent writes the prompt, submits the task, waits and saves the mp4. It runs through [HaryAI](${utm("/en/seedance-2-5")}), where Seedance 2.5 costs ${100 - share}% less than BytePlus's official price and needs no BytePlus account.

What it can do: text to video, a first frame and a last frame, reference images that keep a character or a product, generated sound, and spoken lines with lip sync. Seedance 2.5 Flash for cheap drafts.

## Install

Claude Code:

\`\`\`sh
git clone https://github.com/sunsiyuan/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
\`\`\`

Codex: the same, into \`~/.codex/skills/\`.

Then set your key (get it on your [HaryAI account page](${utm("/en/dashboard")})):

\`\`\`sh
export HARYAI_KEY=...
\`\`\`

Node 18 or later. No other dependencies.

## Use

Ask the agent, for example: "Make a 5 second vertical clip of a cat chasing a laser pointer, with sound." It shows the model, length and approximate price before submitting, and saves the file to \`./out\`.

The script also works on its own:

\`\`\`sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "A paper boat sailing down a rain gutter, close up" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "She turns and smiles" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # resume
\`\`\`

## Cost

Paid from your HaryAI balance per second of video. Seedance 2.5 at 720p is $${full720} a second; Seedance 2.5 Flash at 480p is $${flash480}. A failed or moderated task is refunded. Using the skill in Claude Code still runs on your own Claude plan; only the video is paid from HaryAI. All prices: [Seedance API pricing](${utm("/en/seedance-api-pricing")}).

## Related

- [seedance-2.5-api](https://github.com/sunsiyuan/seedance-2.5-api): the API itself, curl examples, Q&A
- [deepseek-codex-claude-code](https://github.com/sunsiyuan/deepseek-codex-claude-code): DeepSeek V4 in Codex and Claude Code
- API reference: [docs/video.md](https://haryai.com/docs/video.md)

MIT. Prices as of ${today}.
`;

const zh = `# Claude Code 和 Codex 用的 Seedance 2.5 skill

[English](README.md)

装上这个 skill，Claude Code 或 Codex 就能用字节的视频模型 Seedance 2.5 做视频。用大白话说想要什么，agent 会自己写提示词、提交任务、等结果、把 mp4 存下来。它走的是 [HaryAI](${utm("/zh/seedance-2-5")})，Seedance 2.5 是 BytePlus 官方价 ${share} 折，不用开 BytePlus 账号。

能做的事：文生视频，指定首帧和尾帧，用参考图保持同一个角色或同一件商品，生成声音，台词配音并对口型。打草稿可以用更便宜的 Seedance 2.5 Flash。

## 安装

Claude Code：

\`\`\`sh
git clone https://github.com/sunsiyuan/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
\`\`\`

Codex：同样的做法，放进 \`~/.codex/skills/\`。

然后设好 key（在 [HaryAI 账户页](${utm("/zh/dashboard")}) 复制）：

\`\`\`sh
export HARYAI_KEY=...
\`\`\`

需要 Node 18 或更新版本，没有别的依赖。

## 使用

直接跟 agent 说，比如："做一段 5 秒的竖屏视频，一只猫追激光笔，要有声音。" 它提交前会先告诉你用哪个模型、多长、大概多少钱，做好的视频存在 \`./out\`。

脚本也可以单独用：

\`\`\`sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "雨夜的霓虹小巷，一把红伞慢慢走过" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "她转过身笑了" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # 接着查之前提交的任务
\`\`\`

## 费用

按视频秒数从 HaryAI 余额扣费。Seedance 2.5 720p 每秒 $${full720}，Seedance 2.5 Flash 480p 每秒 $${flash480}。失败或审核没过的任务全额退款。在 Claude Code 里用这个 skill，Claude 照常用你自己的订阅，只有视频从 HaryAI 扣费。全部价格见 [Seedance API 价格](${utm("/zh/seedance-api-pricing")})。

## 相关

- [seedance-2.5-api](https://github.com/sunsiyuan/seedance-2.5-api)：接口本身、curl 示例和常见问题
- [deepseek-codex-claude-code](https://github.com/sunsiyuan/deepseek-codex-claude-code)：在 Codex 和 Claude Code 里用 DeepSeek V4
- 接口文档：[docs/video.md](https://haryai.com/docs/video.md)

MIT 许可。价格截至 ${today}。
`;

await writeFile("README.md", en);
await writeFile("README.zh-CN.md", zh);
console.log(`README.md, README.zh-CN.md (share ${share}%, 720p $${full720}/s, flash 480p $${flash480}/s)`);
