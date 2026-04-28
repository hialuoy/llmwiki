function makeSchema(configFile) {
  return `# LLM Wiki — Schema

This is an **LLM Wiki** project. You are the wiki maintainer. Your job is to read raw sources and incrementally build and maintain a structured, interlinked collection of markdown files in the \`wiki/\` directory.

## Directory structure

\`\`\`
raw/              Immutable source documents — read only, never modify
wiki/
  sources/        Summaries of ingested source documents
  entities/       Entity pages (people, organizations, places, objects)
  concepts/       Concept pages (ideas, theories, techniques, frameworks)
  syntheses/      Synthesis pages (comparisons, overviews, cross-cutting analysis)
  index.md        Catalog of all wiki pages, organized by category
  log.md          Chronological append-only activity log
${configFile.padEnd(17)}This schema file — your instructions
\`\`\`

## Key files

- **wiki/index.md** — Catalog of all wiki pages, organized by category. Read this first on every query to find relevant pages. Update it on every ingest.
- **wiki/log.md** — Chronological append-only record. Add an entry for every operation. Format: \`## [YYYY-MM-DD] <type> | <title>\`.

## Workflows

### Ingest
When the user asks you to ingest a new source:
1. Read the source from \`raw/\`
2. Discuss key takeaways with the user
3. Write a summary page in \`wiki/sources/\`
4. Update \`wiki/index.md\` — add the new page with a one-line summary under the Sources section
5. Update relevant entity/concept pages across the wiki with new information, cross-references, or corrections
6. Append an entry to \`wiki/log.md\`

### Query
When the user asks a question:
1. Read \`wiki/index.md\` to find relevant pages
2. Read those pages and synthesize an answer with citations
3. If the answer is valuable, offer to file it as a new wiki page in the appropriate subdirectory

### Lint
When the user asks you to lint the wiki:
1. Read \`wiki/index.md\` for an overview
2. Spot-check pages for: contradictions, stale claims, orphan pages, missing cross-references, important concepts lacking their own page
3. Report findings and suggest fixes

## Conventions

- **Page names**: lowercase-with-hyphens.md (e.g. \`machine-learning.md\`, \`transformer-architecture.md\`)
- **Placement**: Choose the subdirectory by the page's primary purpose:
  - \`sources/\` — summary of an ingested document
  - \`entities/\` — a person, organization, place, or thing
  - \`concepts/\` — an idea, theory, technique, or framework
  - \`syntheses/\` — comparisons, overviews, cross-cutting analysis
- **Frontmatter**: Every wiki page starts with YAML frontmatter:
  \`\`\`yaml
  ---
  title: "Page Title"
  category: source | entity | concept | synthesis
  tags: [tag1, tag2]
  updated: YYYY-MM-DD
  ---
  \`\`\`
- **Cross-references**: Use relative paths from the current page's subdirectory. From \`sources/some-page.md\` to \`entities/person.md\`: \`[person](../entities/person.md)\`. From \`index.md\`: \`[person](entities/person.md)\`.
- **Citations**: Link back to source files: \`[source](../raw/source-file.md)\` (adjust \`../\` depth as needed).
- **No orphan pages**: Every page must be reachable from index.md or linked from at least one other page
`;
}

const indexMd = `# Wiki Index

Catalog of all pages in this wiki. Updated on every ingest.

## Sources

<!-- sources/*.md — Summaries of ingested source documents -->

## Entities

<!-- entities/*.md — People, organizations, places, objects, things with identity -->

## Concepts

<!-- concepts/*.md — Ideas, theories, techniques, frameworks -->

## Syntheses

<!-- syntheses/*.md — Comparisons, overviews, cross-cutting analyses -->
`;

const logMd = `# Activity Log

Chronological record of all operations on this wiki.
Format: \`## [YYYY-MM-DD] <type> | <title>\`
Types: ingest, query, lint

`;

const ingestSkill = `---
name: ingest
description: "Process a new source document into the LLM Wiki. TRIGGER when: user drops a file in raw/, user says 'ingest this' or 'process this source', user asks to add a new article/paper/document to the wiki."
---

# LLM Wiki — Ingest

Process a new source document into the wiki. A single source will typically touch 5-15 wiki pages.

## Prerequisites

Read CLAUDE.md in the project root first — it defines the directory structure, page conventions, and frontmatter format. Follow those conventions exactly.

## Workflow

### Step 1: Read the source

Read the source document from \`raw/\`. If the user hasn't specified which file, list the files in \`raw/\` and ask which one to ingest.

### Step 2: Discuss key takeaways

After reading the source, summarize the key points for the user and ask what they want to emphasize, what's most important, and whether there are specific angles to focus on.

### Step 3: Write the summary page

Create a summary page in \`wiki/sources/\`. Use lowercase-with-hyphens for the filename. Include YAML frontmatter with title, category: source, tags, source path, and updated date. The page should include a concise summary, key entities and concepts (with links), notable claims, and how this source relates to others in the wiki.

### Step 4: Update entity and concept pages

For every entity and concept mentioned: check if a page exists in \`wiki/entities/\` or \`wiki/concepts/\`. If it exists, update it with new information or corrections. If it doesn't exist but is significant, create a stub. If the new source contradicts an existing claim, note the contradiction explicitly.

### Step 5: Create or update synthesis pages

If the source enables a new comparison, overview, or cross-cutting analysis, create or update a page in \`wiki/syntheses/\`.

### Step 6: Update index.md

Read \`wiki/index.md\`. Add the new source page and any new entity/concept/synthesis pages to their respective sections with a one-line description.

### Step 7: Append to log.md

Add an entry to \`wiki/log.md\`:
\`\`\`markdown
## [YYYY-MM-DD] ingest | Source Title

- Source: raw/source-filename
- Pages created: [list]
- Pages updated: [list]
\`\`\`
`;

const querySkill = `---
name: query
description: "Answer questions against the LLM Wiki. TRIGGER when: user asks a question prefixed with 'wiki' or 'query', user wants to find information stored in the wiki, user asks for a comparison, analysis, overview, or synthesis from wiki content."
---

# LLM Wiki — Query

Answer questions against the wiki by finding relevant pages, synthesizing an answer, and optionally filing the result.

## Prerequisites

Read CLAUDE.md and wiki/index.md first to find relevant pages.

## Workflow

### Step 1: Read the index

Always start with \`wiki/index.md\`. It catalogs every page in the wiki by category. Identify which pages are likely relevant to the user's question.

### Step 2: Read relevant pages

Read the pages identified in Step 1. Follow cross-references to discover additional relevant pages. If the user's question spans multiple categories, read from all relevant subdirectories.

### Step 3: Synthesize an answer

Produce an answer that directly addresses the user's question, cites specific pages as sources, notes any gaps in the wiki's coverage, and flags contradictions if different pages say conflicting things.

### Step 4: Choose the output format

Match the format to the question:
- **Factual lookup** → inline answer with citations
- **Comparison** → markdown comparison table, filed to \`wiki/syntheses/\`
- **Overview / survey** → structured markdown page, filed to \`wiki/syntheses/\`
- **Deep analysis** → longer markdown essay, filed to \`wiki/syntheses/\`

### Step 5: Offer to file the answer

If the answer is valuable beyond this conversation, ask the user if they want to save it as a wiki page. If yes, write it to the appropriate subdirectory, add it to \`wiki/index.md\`, append an entry to \`wiki/log.md\`, and add cross-references from the filed page to its sources.
`;

const lintSkill = `---
name: lint
description: "Health-check the LLM Wiki for quality issues. TRIGGER when: user says 'lint the wiki', 'check the wiki', 'health check', or 'audit the wiki'."
---

# LLM Wiki — Lint

Periodically health-check the wiki to keep it consistent and trustworthy as it grows.

## Prerequisites

Read CLAUDE.md and wiki/index.md first to understand the current state of the wiki.

## Workflow

### Step 1: Read the overview

Read \`wiki/index.md\` and \`wiki/log.md\` to understand how many pages exist, what's been recently changed, and the overall shape of the wiki.

### Step 2: Check for contradictions

Spot-check pages in the same category for conflicting claims. Report each contradiction with the two conflicting sources and the specific claims.

### Step 3: Check for stale claims

For pages that reference specific data (statistics, dates, "current" states): is the information still accurate? Has a newer source superseded an older claim?

### Step 4: Find orphan pages

Cross-reference \`wiki/index.md\` against the actual files in \`wiki/sources/\`, \`wiki/entities/\`, \`wiki/concepts/\`, \`wiki/syntheses/\`: are there files not listed in index.md? Are there pages with no inbound links?

### Step 5: Check cross-references

For a sample of wiki pages, check that entity/concept links resolve to actual files and source citations point to real files in \`raw/\`.

### Step 6: Identify missing pages

Look for important concepts mentioned across multiple pages but lacking their own page, entities that appear frequently but have no page, and opportunities for synthesis pages that haven't been created.

### Step 7: Suggest new sources

Based on gaps in the wiki's coverage, suggest topics to investigate, questions a web search could answer, and types of sources that would strengthen the wiki.

### Step 8: Report and append to log

Summarize findings in categories: **Critical** (contradictions, broken links, stale facts), **Should fix** (orphans, missing cross-references), **Nice to have** (missing pages, new source suggestions). Append an entry to \`wiki/log.md\`.
`;

module.exports = {
  makeSchema,
  indexMd,
  logMd,
  ingestSkill,
  querySkill,
  lintSkill,
};
