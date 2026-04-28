# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # Install the one dependency (commander)
npm link                 # Link globally so `wikilm` is available in PATH
wikilm init [dir]       # Test init in target directory
wikilm init --help      # Show usage
```

No build, lint, or test commands exist yet. The CLI runs directly with Node.

## Architecture

Single-command CLI that bootstraps an LLM Wiki project. Two layers:

**`bin/cli.js`** — Entry point. Defines the `ALL_TOOLS` list, parses `--agent` (comma-separated or `"all"`), validates, delegates to `init()`.

**`src/init.js`** — Core logic. The `TOOLS` registry maps each AI coding tool to its config file path and a `skills` boolean (only `Codex` gets `.Codex/skills/`). The `init()` function resolves agent names to tools, deduplicates by file path (e.g., codex/opencode/kilo-code/kilo-cli all share `AGENTS.md`), collects files + directories, creates them idempotently (skips existing), and prints a summary.

**`src/templates.js`** — All file content as template literals. `makeSchema(configFile)` generates the schema markdown for a given config filename (dynamically inserts the correct filename in the directory diagram). Also exports `indexMd`, `logMd`, and three skill templates (`ingestSkill`, `querySkill`, `lintSkill`).

## Adding a new tool

1. Add the tool name to `ALL_TOOLS` in `bin/cli.js`
2. Add an entry to `TOOLS` in `src/init.js` with `{ name, file, skills }`
3. If the tool needs a unique config file (not shared), `makeSchema()` will generate the right content automatically — no template changes needed
