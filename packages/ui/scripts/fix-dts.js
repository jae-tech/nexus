/**
 * Fix .d.ts files to remove .js extensions from imports
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

function fixDtsFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');

  // Remove .js extensions from import/export statements in .d.ts files
  content = content.replace(/from\s+["'](.*)\.js["']/g, 'from "$1"');
  content = content.replace(/export\s+\*\s+from\s+["'](.*)\.js["']/g, 'export * from "$1"');
  content = content.replace(/export\s+\{[^}]+\}\s+from\s+["'](.*)\.js["']/g, (match) => {
    return match.replace(/\.js["']/, '"');
  });

  writeFileSync(filePath, content, 'utf-8');
}

function processDir(dir) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (item.endsWith('.d.ts')) {
      console.log(`Fixing: ${fullPath}`);
      fixDtsFile(fullPath);
    }
  }
}

console.log('Fixing .d.ts files...');
processDir(distDir);
console.log('Done!');
