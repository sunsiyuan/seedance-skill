# Claude Code 和 Codex 用的 Seedance 2.5 skill

[English](README.md)

装上这个 skill，Claude Code 或 Codex 就能用字节的视频模型 Seedance 2.5 做视频。用大白话说想要什么，agent 会自己写提示词、提交任务、等结果、把 mp4 存下来。它走的是 [HaryAI](https://haryai.com/zh/seedance-2-5?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)，Seedance 2.5 是 BytePlus 官方价 88 折，不用开 BytePlus 账号。

能做的事：文生视频，指定首帧和尾帧，用参考图保持同一个角色或同一件商品，生成声音，台词配音并对口型。打草稿可以用更便宜的 Seedance 2.5 Flash。

## 安装

Claude Code：

```sh
git clone https://github.com/sunsiyuan/seedance-skill /tmp/seedance-skill
cp -r /tmp/seedance-skill/seedance ~/.claude/skills/
```

Codex：同样的做法，放进 `~/.codex/skills/`。

然后设好 key（在 [HaryAI 账户页](https://haryai.com/zh/dashboard?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill) 复制）：

```sh
export HARYAI_KEY=...
```

需要 Node 18 或更新版本，没有别的依赖。

## 使用

直接跟 agent 说，比如："做一段 5 秒的竖屏视频，一只猫追激光笔，要有声音。" 它提交前会先告诉你用哪个模型、多长、大概多少钱，做好的视频存在 `./out`。

脚本也可以单独用：

```sh
node ~/.claude/skills/seedance/scripts/seedance.mjs "雨夜的霓虹小巷，一把红伞慢慢走过" --duration 5 --ratio 9:16
node ~/.claude/skills/seedance/scripts/seedance.mjs "她转过身笑了" --first frame.jpg --flash --resolution 480p
node ~/.claude/skills/seedance/scripts/seedance.mjs --task <id>    # 接着查之前提交的任务
```

## 费用

按视频秒数从 HaryAI 余额扣费。Seedance 2.5 720p 每秒 $0.203，Seedance 2.5 Flash 480p 每秒 $0.059。失败或审核没过的任务全额退款。在 Claude Code 里用这个 skill，Claude 照常用你自己的订阅，只有视频从 HaryAI 扣费。全部价格见 [Seedance API 价格](https://haryai.com/zh/seedance-api-pricing?utm_source=github&utm_medium=readme&utm_campaign=seedance-skill)。

## 相关

- [seedance-2.5-api](https://github.com/sunsiyuan/seedance-2.5-api)：接口本身、curl 示例和常见问题
- [seedance-comfyui](https://github.com/sunsiyuan/seedance-comfyui)：在 ComfyUI 里用（ComfyUI Manager 里能搜到）
- [n8n-nodes-haryai](https://github.com/sunsiyuan/n8n-nodes-haryai)：在 n8n 里用（npm 包 `n8n-nodes-haryai`）
- [deepseek-codex-claude-code](https://github.com/sunsiyuan/deepseek-codex-claude-code)：在 Codex 和 Claude Code 里用 DeepSeek V4
- 接口文档：[docs/video.md](https://haryai.com/docs/video.md)

MIT 许可。价格截至 2026-11-20。
