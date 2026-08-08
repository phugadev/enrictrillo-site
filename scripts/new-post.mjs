#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

/** Keep in sync with `wavelengths` in lib/site.ts. */
const WAVELENGTHS = [
  ["interface", "590nm — product/frontend work"],
  ["systems", "520nm — architecture, backend and data"],
  ["compute", "470nm — infrastructure, deploys and hardware"],
  ["intelligence", "405nm — models, agents and AI engineering"],
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

    let wavelength;
    while (!wavelength) {
      const answer = await prompter.ask("\nChoose 1-4 (or type the name): ");
      if (answer === null) return abort("No wavelength given — nothing written.");
      const normalised = answer.trim().toLowerCase();
      const byIndex = WAVELENGTHS[Number(normalised) - 1];
      const byName = WAVELENGTHS.find(([name]) => name === normalised);
      if (byIndex) wavelength = byIndex[0];
      else if (byName) wavelength = byName[0];
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

    const date = new Date().toISOString().slice(0, 10);
    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      `excerpt: ${yamlString(excerpt || "TODO — one sentence for the index page and meta description.")}`,
      `date: ${yamlString(date)}`,
      `wavelength: ${yamlString(wavelength)}`,
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
