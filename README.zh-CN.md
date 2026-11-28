# Claude Code 和 Codex 用的 Seedance 2.5 skill

[English](README.md)

装上这个 skill，Claude Code 或 Codex 就能用字节的视频模型 Seedance 2.5 做视频。用大白话说想要什么，agent 会自己写提示词、提交任务、等结果、把 mp4 存下来。它走的是 [HaryAI](https://haryai.com/zh/seedance-2-5?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)，Seedance 2.5 是 BytePlus 官方价 88 折，不用开 BytePlus 账号。

能做的事：文生视频，指定首帧和尾帧，用参考图保持同一个角色或同一件商品，生成声音，台词配音并对口型。打草稿可以用更便宜的 Seedance 2.5 Flash。

## 安装

Claude Code：

```sh
git clone https://github.com/haryai-com/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
```

Codex：同样的做法，放进 `~/.codex/skills/`。其他能加载 skill 的 Agent（Cursor、Gemini CLI、OpenCode、Hermes Agent、OpenClaw 等）：放进它读取 skill 的文件夹，很多都读 `~/.agents/skills/`。

然后把 key 交给它，key 在 [HaryAI 账户页](https://haryai.com/zh/dashboard?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill) 复制。桌面应用不读 shell 配置文件里的 `export`，所以要把 key 存在 Agent 自己保存配置的地方，名字叫 `HARYAI_KEY`（Codex 是 `~/.codex/config.toml` 的 `[shell_environment_policy.set]`，Claude Code 是 `~/.claude/settings.json` 的 `env`），或者把 key 单独存成一个文本文件 `~/.haryai/key`（Windows 上是 `%USERPROFILE%\.haryai\key`，文件名后面不要带 `.txt`）。

需要 Node 18 或更新版本，没有别的依赖。

还想出图，或者想让 Agent 每次挑最便宜的模型？Claude Code 和 Codex 可以装 [HaryAI 插件](https://github.com/haryai-com/plugins)，两样都能做；这个 skill 只管视频。

## 使用

直接跟 agent 说，比如："做一段 5 秒的竖屏视频，一只猫追激光笔，要有声音。" 它提交前会先告诉你用哪个模型、多长、大概多少钱，等你确认了才提交（在 Claude Code 里是一张确认卡），做好的视频存在 `./out`。

画面要紧的镜头，比如人物或者商品，它会先用 Nano Banana 2.1 出一张首帧图（一张大约 $0.0168）给你确认，免得花一段视频的钱才发现脸不对。几段视频可以接起来：每段从上一段的最后一帧开始（需要 ffmpeg）。

脚本也可以单独用：

```sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "雨夜的霓虹小巷，一把红伞慢慢走过" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "她转过身笑了" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # 接着查之前提交的任务
node ~/.claude/skills/seedance/scripts/seedance.mjs "她转过身笑了" --first frame.jpg --estimate   # 只估价，不提交
node ~/.claude/skills/seedance/scripts/keyframe.mjs "城市街头穿黄色雨衣的女人，竖构图" --ratio 9:16   # 先出一张首帧图
```

## 费用

按视频秒数从 HaryAI 余额扣费。Seedance 2.5 720p 每秒 $0.203，Seedance 2.5 Flash 480p 每秒 $0.059。失败或审核没过的任务全额退款。在 Claude Code 里用这个 skill，Claude 照常用你自己的订阅，只有视频从 HaryAI 扣费。全部价格见 [Seedance API 价格](https://haryai.com/zh/seedance-api-pricing?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)。

## 相关

- [seedance-2.5-api](https://github.com/haryai-com/seedance-2.5-api)：接口本身、curl 示例和常见问题
- [seedance-comfyui](https://github.com/haryai-com/seedance-comfyui)：在 ComfyUI 里用（ComfyUI Manager 里能搜到）
- [n8n-nodes-haryai](https://github.com/haryai-com/n8n-nodes-haryai)：在 n8n 里用（npm 包 `n8n-nodes-haryai`）
- [deepseek-codex-claude-code](https://github.com/haryai-com/deepseek-codex-claude-code)：在 Codex 和 Claude Code 里用 DeepSeek V4
- [nano-banana-api](https://github.com/haryai-com/nano-banana-api)：用 OpenAI 图片接口或 Gemini 原生格式调 Nano Banana 2.1 和 2
- 接口文档：[docs/video.md](https://haryai.com/docs/video.md)

MIT 许可。价格截至 2026-11-28。
