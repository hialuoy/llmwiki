const fs = require("fs");
const path = require("path");
const {
  makeSchema,
  indexMd,
  logMd,
  ingestSkill,
  querySkill,
  lintSkill,
} = require("./templates");

const TOOLS = [
  { name: "claude", file: "CLAUDE.md", skills: true },
  { name: "codex", file: "AGENTS.md", skills: false },
  { name: "cursor", file: ".cursorrules", skills: false },
  { name: "cline", file: ".clinerules", skills: false },
  { name: "opencode", file: "AGENTS.md", skills: false },
  { name: "qwen-code", file: path.join(".qwen", "rules", "llm-wiki.md"), skills: false },
  { name: "qoder", file: path.join(".qoder", "rules", "llm-wiki.md"), skills: false },
  { name: "lingma", file: path.join(".lingma", "rules", "llm-wiki.md"), skills: false },
  { name: "kilo-code", file: "AGENTS.md", skills: false },
  { name: "kilo-cli", file: "AGENTS.md", skills: false },
  { name: "trae", file: path.join(".trae", "rules", "llm-wiki.md"), skills: false },
];

function init(directory, agentNames) {
  const dir = path.resolve(directory);

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }

  // Resolve selected tools (dedup by file path)
  const seen = new Set();
  const selected = [];
  const hasClaude = agentNames.includes("claude");

  for (const name of agentNames) {
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool || seen.has(tool.file)) continue;
    seen.add(tool.file);
    selected.push(tool);
  }

  const rawDir = path.join(dir, "raw");
  const wikiDir = path.join(dir, "wiki");
  const files = [];

  // Wiki files
  files.push({ dir: wikiDir, name: "index.md", content: indexMd });
  files.push({ dir: wikiDir, name: "log.md", content: logMd });

  // Schema files for selected tools
  for (const tool of selected) {
    files.push({
      dir: path.join(dir, path.dirname(tool.file)),
      name: path.basename(tool.file),
      content: makeSchema(tool.file),
    });
  }

  // Claude Code skills (each skill in its own subdirectory with SKILL.md)
  const skillsDir = path.join(dir, ".claude", "skills");
  if (hasClaude) {
    files.push({ dir: path.join(skillsDir, "ingest"), name: "SKILL.md", content: ingestSkill });
    files.push({ dir: path.join(skillsDir, "query"), name: "SKILL.md", content: querySkill });
    files.push({ dir: path.join(skillsDir, "lint"), name: "SKILL.md", content: lintSkill });
  }

  // Collect directories to create
  const wikiSubdirs = ["sources", "entities", "concepts", "syntheses"];
  const dirs = [rawDir, wikiDir, ...wikiSubdirs.map((d) => path.join(wikiDir, d))];
  for (const f of files) {
    if (!dirs.includes(f.dir)) {
      dirs.push(f.dir);
    }
  }

  // Create directories
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
      console.log(`Created: ${d}/`);
    }
  }

  // Create files (don't overwrite existing)
  for (const f of files) {
    const filepath = path.join(f.dir, f.name);
    if (fs.existsSync(filepath)) {
      console.log(`Skipped (already exists): ${filepath}`);
      continue;
    }
    fs.writeFileSync(filepath, f.content, "utf-8");
    console.log(`Created: ${filepath}`);
  }

  // Summary
  console.log("\nLLM Wiki project initialized.");
  console.log(`  Agents:  ${agentNames.join(", ")}`);
  if (hasClaude) {
    console.log(`  Skills:  ${skillsDir}/`);
  }
  console.log(`  Sources: ${rawDir}/`);
  console.log(`  Wiki:    ${wikiDir}/`);

  // Show which config files were created
  const createdFiles = selected.map((t) => t.file);
  if (createdFiles.length) {
    console.log(`  Configs: ${createdFiles.join(", ")}`);
  }
}

module.exports = { init };
