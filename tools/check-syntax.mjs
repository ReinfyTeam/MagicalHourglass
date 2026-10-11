import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const javascriptFiles = ['defaults.docker.js', 'defaults.example.js'];

function collectJavaScriptFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      collectJavaScriptFiles(path);
    } else if (entry.isFile() && path.endsWith('.js')) {
      javascriptFiles.push(path);
    }
  }
}

collectJavaScriptFiles('src');

for (const file of javascriptFiles.sort()) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Checked JavaScript syntax for ${javascriptFiles.length} files.`);
