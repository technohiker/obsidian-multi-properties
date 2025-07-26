import fs from 'fs-extra';
import path from 'path';
import open from 'open';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const vaultPath = process.env.OBSIDIAN_TEST_VAULT_PATH;

    if (!vaultPath) {
        console.error('Error: OBSIDIAN_TEST_VAULT_PATH environment variable not set.');
        console.error('Please set it to the absolute path of your test vault.');
        process.exit(1);
    }

    if (!fs.existsSync(vaultPath)) {
        console.error(`Error: The path specified in OBSIDIAN_TEST_VAULT_PATH does not exist: ${vaultPath}`);
        process.exit(1);
    }

    const sourceDir = path.resolve(__dirname, '../test-notes');
    if (!fs.existsSync(sourceDir)) {
        console.error(`Error: Source directory for test notes not found at: ${sourceDir}`);
        process.exit(1);
    }

    try {
        console.log(`Cleaning and initializing test vault at: ${vaultPath}...`);

        // Get all items in the vault root
        const items = await fs.readdir(vaultPath);

        // Loop through and remove each item, except for the .obsidian directory
        for (const item of items) {
            if (item !== '.obsidian') {
                await fs.remove(path.join(vaultPath, item));
            }
        }

        // Now, specifically clean the plugins directory inside .obsidian
        const pluginsPath = path.join(vaultPath, '.obsidian', 'plugins');
        // emptyDir will ensure the directory exists, and then clean it.
        await fs.emptyDir(pluginsPath);

        console.log('Cleaned vault root and plugins directory.');

        // Copy the contents of test-notes into the vault
        await fs.copy(sourceDir, vaultPath, { overwrite: true });
        console.log('Test vault initialized successfully.');
    } catch (err) {
        console.error('Failed to initialize test vault:', err);
        process.exit(1);
    }

    const vaultName = path.basename(vaultPath);
    const uri = `obsidian://open?vault=${encodeURIComponent(vaultName)}`;

    console.log(`Attempting to open vault "${vaultName}" with URI: ${uri}`);

    try {
        await open(uri);
        console.log(`Successfully sent request to open vault "${vaultName}".`);
    } catch (err) {
        console.error(`Failed to send request to open Obsidian. Please ensure Obsidian is installed and the obsidian:// URI scheme is registered.`, err);
        process.exit(1);
    }
})();