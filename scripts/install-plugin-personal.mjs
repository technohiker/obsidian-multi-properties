
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module for resolving source files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let vaultPath = process.env.OBSIDIAN_PERSONAL_VAULT_PATH || '';
// Handle paths that might be wrapped in quotes
if (vaultPath.startsWith('"') && vaultPath.endsWith('"')) {
    vaultPath = vaultPath.substring(1, vaultPath.length - 1);
}

if (!vaultPath) {
    console.warn('Warning: OBSIDIAN_PERSONAL_VAULT_PATH environment variable not set. Cannot install plugin to personal vault.');
    process.exit(0); // Not a script failure, but a configuration issue.
}

if (!fs.existsSync(vaultPath)) {
    console.warn(`Warning: The path specified in OBSIDIAN_PERSONAL_VAULT_PATH does not exist: ${vaultPath}`);
    process.exit(0);
}

const pluginDirName = 'obsidian-multi-properties';
const pluginDestPath = path.join(vaultPath, '.obsidian', 'plugins', pluginDirName);

if (!fs.existsSync(pluginDestPath)) {
    fs.mkdirSync(pluginDestPath, { recursive: true });
}

const filesToCopy = ['main.js', 'manifest.json', 'styles.css'];

filesToCopy.forEach(file => {
    const sourceFile = path.resolve(__dirname, '../', file); // Source files are in the root dir
    const destFile = path.join(pluginDestPath, file);
    if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Copied ${sourceFile} to ${destFile}`);
    } else {
        console.error(`Error: ${sourceFile} not found. Make sure to run 'npm run build' first.`);
        process.exit(1);
    }
});
