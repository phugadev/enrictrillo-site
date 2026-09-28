#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

/** Keep in sync with `topics` in lib/site.ts. */
const WAVELENGTHS = [
  ["frontend", "product thinking and interfaces"],
  ["backend", "architecture, services and data"],
  ["infrastructure", "deploys, hosting and hardware"],
  ["ai", "models, agents and evals"],
];

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * Buffers every line as it arrives rather than only while a question is
 * pending. readline/promises' question() drops lines that land between
 * prompts, which breaks piped input (and Ctrl-D) — this keeps the script
 * usable both interactively and from a script. `ask` resolves to null at EOF.
 */
function createPrompter() {
  const rl = readline.createInterface({ input, output });
  const pending = [];
  const waiting = [];
  let closed = false;

  rl.on("line", (line) => {
    const next = waiting.shift();
    if (next) next(line);
    else pending.push(line);
  });

  rl.on("close", () => {
    closed = true;
    while (waiting.length) waiting.shift()(null);
  });

  return {
    ask(question) {
      output.write(question);
      if (pending.length) return Promise.resolve(pending.shift());
      if (closed) return Promise.resolve(null);
      return new Promise((resolve) => waiting.push(resolve));
    },
    close: () => rl.close(),
  };
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Frontmatter values are emitted double-quoted, so escape any double quotes. */
function yamlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function abort(message) {
  console.error(`\n${message}`);
  process.exitCode = 1;
}

async function main() {
  const prompter = createPrompter();

  try {
    const title = (await prompter.ask("Title: "))?.trim();
    if (!title) return abort("A title is required — nothing written.");

    output.write("\nWavelength:\n");
    WAVELENGTHS.forEach(([name, desc], i) => output.write(`  ${i + 1}. ${name.padEnd(13)} ${desc}\n`));

    let topic;
    while (!topic) {
      const answer = await prompter.ask("\nChoose 1-4 (or type the name): ");
      if (answer === null) return abort("No topic given — nothing written.");
      const normalised = answer.trim().toLowerCase();
      const byIndex = WAVELENGTHS[Number(normalised) - 1];
      const byName = WAVELENGTHS.find(([name]) => name === normalised);
      if (byIndex) topic = byIndex[0];
      else if (byName) topic = byName[0];
      else output.write("Not one of the four — try again.\n");
    }

    const excerpt = (await prompter.ask("\nExcerpt (one sentence, optional): "))?.trim() ?? "";
    const series =
      (await prompter.ask("Series (project or thread this belongs to, optional): "))?.trim() ?? "";

    const suggested = slugify(title);
    const slugAnswer = (await prompter.ask(`\nSlug [${suggested}]: `))?.trim() ?? "";
    const slug = slugify(slugAnswer || suggested);

    if (!slug) return abort("That title produced an empty filename — pick something with letters.");

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return abort(`content/posts/${slug}.mdx already exists — nothing written.`);
    }

    // The local calendar date. toISOString() is UTC, which dated a post
    // written just after midnight in London (BST) as the day before.
    const now = new Date();
    const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map((n, i) => String(n).padStart(i === 0 ? 4 : 2, "0"))
      .join("-");
    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      `excerpt: ${yamlString(excerpt || "TODO — one sentence for the index page and meta description.")}`,
      `date: ${yamlString(date)}`,
      `topic: ${yamlString(topic)}`,
      ...(series ? [`series: ${yamlString(series)}`] : []),
      "draft: true",
      "---",
      "",
      "",
    ].join("\n");

    fs.mkdirSync(POSTS_DIR, { recursive: true });
    fs.writeFileSync(filePath, frontmatter, "utf-8");

    output.write(`\n✓ content/posts/${slug}.mdx\n`);
    output.write(`  http://localhost:3000/blog/${slug}\n`);
    output.write("\n  Created as draft: true — flip it to false to publish.\n");
  } finally {
    prompter.close();
  }
}

main();
