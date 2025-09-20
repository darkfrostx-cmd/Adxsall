#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, 'context-dump.md');
const INCLUDE_LOGS = process.env.DUMP_CONTEXT_INCLUDE_LOGS !== 'false';

const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'out',
  '.cache',
  'coverage',
  'tmp'
]);

if (!INCLUDE_LOGS) {
  EXCLUDED_DIRECTORIES.add('logs');
}
const EXCLUDED_FILES = new Set([
  path.basename(OUTPUT_FILE)
]);

async function getGitSection(title, command, args) {
  try {
    const { stdout } = await execFileAsync(command, args, { cwd: ROOT_DIR });
    const content = stdout.trim();
    return { title, content: content.length ? content : '[no output]' };
  } catch (error) {
    return { title, content: `Error executing ${command} ${args.join(' ')}: ${error.message}` };
  }
}

async function walkDirectory(startDir, visitedDirs, files) {
  const entries = await fs.promises.readdir(startDir, { withFileTypes: true });

  visitedDirs.add(path.relative(ROOT_DIR, startDir) || '.');

  for (const entry of entries) {
    const entryPath = path.join(startDir, entry.name);
    const relativePath = path.relative(ROOT_DIR, entryPath);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.has(entry.name)) {
        continue;
      }
      await walkDirectory(entryPath, visitedDirs, files);
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name)) {
        continue;
      }
      const stats = await fs.promises.stat(entryPath);
      let buffer;
      try {
        buffer = await fs.promises.readFile(entryPath);
      } catch (error) {
        files.push({
          relativePath,
          size: stats.size,
          isBinary: true,
          error: `Error reading file: ${error.message}`
        });
        continue;
      }

      const isBinary = buffer.includes(0);
      files.push({
        relativePath,
        size: stats.size,
        isBinary,
        contents: isBinary ? undefined : buffer.toString('utf8')
      });
    }
  }
}

async function generateContextDump() {
  const visitedDirs = new Set();
  const files = [];

  await walkDirectory(ROOT_DIR, visitedDirs, files);

  const gitStatus = await getGitSection('git status --short', 'git', ['status', '--short']);
  const gitLog = await getGitSection('git log --oneline -n 20', 'git', ['log', '--oneline', '-n', '20']);

  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  const sortedDirs = Array.from(visitedDirs).sort();

  const writeStream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' });

  const writeLine = (line = '') => {
    writeStream.write(line + '\n');
  };

  writeLine('# Workspace Context Dump');
  writeLine();
  writeLine(`- Generated at: ${new Date().toISOString()}`);
  writeLine(`- Root directory: ${ROOT_DIR}`);
  writeLine(`- Output file: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  writeLine();
  writeLine('## Git Metadata');
  writeLine();
  for (const section of [gitStatus, gitLog]) {
    writeLine(`### ${section.title}`);
    writeLine();
    writeLine('```');
    writeLine(section.content);
    writeLine('```');
    writeLine();
  }

  writeLine('## Traversed Directories');
  writeLine();
  for (const dir of sortedDirs) {
    writeLine(`- ${dir}`);
  }
  writeLine();

  writeLine('## File Contents');
  writeLine();

  for (const file of files) {
    writeLine('---');
    writeLine(`### File: ${file.relativePath}`);
    writeLine();
    writeLine(`- Size: ${file.size} bytes`);
    writeLine();
    if (file.error) {
      writeLine(`_Unable to read file. ${file.error}_`);
    } else if (file.isBinary) {
      writeLine('_Binary file contents omitted._');
    } else {
      writeLine('```text');
      writeLine(file.contents || '');
      writeLine('```');
    }
    writeLine();
  }

  await new Promise((resolve, reject) => {
    writeStream.on('error', reject);
    writeStream.end(resolve);
  });

  console.log(`Context dump generated at ${OUTPUT_FILE}`);
}

generateContextDump().catch((error) => {
  console.error('Failed to generate context dump:', error);
  process.exitCode = 1;
});
