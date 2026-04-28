# LLM Wiki CLI

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

A CLI to initialize an **LLM Wiki** project — a structured, interlinked knowledge base maintained by LLM agents. Drop raw source documents into `raw/`, and let your AI coding assistant build and maintain the wiki for you.

### Installation

```bash
npm install -g llmwiki
```

### Usage

```bash
llmwiki init [directory]          # Initialize in target dir (defaults to current)
llmwiki init --agent all          # Generate configs for all supported tools
llmwiki init --agent claude,codex # Generate configs for specific tools
llmwiki init --help               # Show help
```

### Supported Agents

| Agent | Config File | Skills |
|-------|-------------|--------|
| claude | `CLAUDE.md` | ingest, query, lint |
| codex | `AGENTS.md` | — |
| opencode | `AGENTS.md` | — |
| kilo-code | `AGENTS.md` | — |
| kilo-cli | `AGENTS.md` | — |
| cursor | `.cursorrules` | — |
| cline | `.clinerules` | — |
| qwen-code | `.qwen/rules/llm-wiki.md` | — |
| qoder | `.qoder/rules/llm-wiki.md` | — |
| lingma | `.lingma/rules/llm-wiki.md` | — |
| trae | `.trae/rules/llm-wiki.md` | — |

### What gets created

```
your-project/
├── raw/                          # Drop source documents here
├── wiki/
│   ├── index.md                  # Catalog of all wiki pages
│   ├── log.md                    # Chronological activity log
│   ├── sources/                  # Summaries of ingested documents
│   ├── entities/                 # People, orgs, places, objects
│   ├── concepts/                 # Ideas, theories, frameworks
│   └── syntheses/                # Comparisons, cross-cutting analysis
├── CLAUDE.md                    # (if --agent claude) Instructions for Claude Code
├── .cursorrules                 # (if --agent cursor) Instructions for Cursor
└── .claude/skills/
    ├── ingest/SKILL.md           # Skill: process new source documents
    ├── query/SKILL.md            # Skill: answer questions from the wiki
    └── lint/SKILL.md             # Skill: health-check the wiki
```

### License

MIT

---

<a name="中文"></a>

## 中文

**LLM Wiki CLI** — 一键初始化 LLM Wiki 项目。LLM Wiki 是一个由 AI 助手维护的结构化、互联的知识库。将原始文档放入 `raw/` 目录，AI 助手会自动帮你构建和维护 wiki。

### 安装

```bash
npm install -g llmwiki
```

### 使用

```bash
llmwiki init [目标目录]              # 在指定目录初始化（默认当前目录）
llmwiki init --agent all            # 为所有支持的 AI 工具生成配置文件
llmwiki init --agent claude,codex   # 为指定工具生成配置
llmwiki init --help                 # 查看帮助
```

### 支持的 AI 工具

| 工具 | 配置文件 | 技能 |
|------|----------|------|
| claude | `CLAUDE.md` | ingest, query, lint |
| codex | `AGENTS.md` | — |
| opencode | `AGENTS.md` | — |
| kilo-code | `AGENTS.md` | — |
| kilo-cli | `AGENTS.md` | — |
| cursor | `.cursorrules` | — |
| cline | `.clinerules` | — |
| qwen-code | `.qwen/rules/llm-wiki.md` | — |
| qoder | `.qoder/rules/llm-wiki.md` | — |
| lingma | `.lingma/rules/llm-wiki.md` | — |
| trae | `.trae/rules/llm-wiki.md` | — |

### 生成的文件结构

```
your-project/
├── raw/                          # 原始文档放这里
├── wiki/
│   ├── index.md                  # 全站目录
│   ├── log.md                    # 操作日志
│   ├── sources/                  # 原始文档摘要
│   ├── entities/                 # 人物、组织、地点、事物
│   ├── concepts/                 # 概念、理论、方法论
│   └── syntheses/                # 对比分析、综合论述
├── CLAUDE.md                    # Claude Code 的指令文件
├── .cursorrules                 # Cursor 的指令文件
└── .claude/skills/
    ├── ingest/SKILL.md           # 技能：处理新文档
    ├── query/SKILL.md            # 技能：从 wiki 中查询
    └── lint/SKILL.md             # 技能：wiki 健康检查
```

### 开源协议

MIT
