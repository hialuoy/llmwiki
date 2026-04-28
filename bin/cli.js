#!/usr/bin/env node

const { program } = require("commander");
const { init } = require("../src/init");
const { version } = require("../package.json");

const ALL_TOOLS = [
  "claude",
  "codex",
  "cursor",
  "cline",
  "opencode",
  "qwen-code",
  "qoder",
  "lingma",
  "kilo-code",
  "kilo-cli",
  "trae",
];

program
  .name("wikilm")
  .description("Initialize an LLM Wiki project structure")
  .version(version);

program
  .command("init")
  .description("Initialize a new LLM Wiki in the specified directory")
  .argument("[directory]", "Target directory (defaults to current directory)", ".")
  .option(
    "--agent <names>",
    `AI coding tools to configure. Comma-separated or "all". Options: ${ALL_TOOLS.join(", ")}`,
    "claude"
  )
  .action((directory, options) => {
    const names = options.agent === "all" ? ALL_TOOLS : options.agent.split(",").map((s) => s.trim());
    const invalid = names.filter((n) => !ALL_TOOLS.includes(n));
    if (invalid.length) {
      console.error(`Error: unknown agent(s): ${invalid.join(", ")}`);
      console.error(`Valid options: ${ALL_TOOLS.join(", ")} or "all"`);
      process.exit(1);
    }
    init(directory, names);
  });

program.parse();
