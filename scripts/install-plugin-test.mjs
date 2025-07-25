import 'dotenv/config';
import path from 'path';
import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const pluginName = manifest.id;

const buildDir = './';
const testVaultPath = process.env.OBSIDIAN_TEST_VAULT_PATH;

if (!testVaultPath) {
  console.error(
    'Error: OBSIDIAN_TEST_VAULT_PATH environment variable is not set.'
  );
  process.exit(1);
}

const pluginPath = path.join(testVaultPath, '.obsidian', 'plugins', pluginName);

if (!fs.existsSync(pluginPath)) {
  fs.mkdirSync(pluginPath, { recursive: true });
}

fs.copyFileSync(
  path.join(buildDir, 'main.js'),
  path.join(pluginPath, 'main.js')
);
fs.copyFileSync(
  path.join(buildDir, 'manifest.json'),
  path.join(pluginPath, 'manifest.json')
);
fs.copyFileSync(
  path.join(buildDir, 'styles.css'),
  path.join(pluginPath, 'styles.css')
);

console.log(`Plugin installed successfully in test vault: ${pluginPath}`);