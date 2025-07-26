
import open from 'open';
import path from 'path';
import fs from 'fs';

(async () => {
    let vaultPath = process.env.OBSIDIAN_PERSONAL_VAULT_PATH || '';
    // Handle paths that might be wrapped in quotes
    if (vaultPath.startsWith('"') && vaultPath.endsWith('"')) {
        vaultPath = vaultPath.substring(1, vaultPath.length - 1);
    }

    if (!vaultPath) {
        console.warn('Warning: OBSIDIAN_PERSONAL_VAULT_PATH environment variable not set. Cannot open personal vault.');
        process.exit(0); // Not a script failure, but a configuration issue.
    }

    if (!fs.existsSync(vaultPath)) {
        console.warn(`Warning: The path specified in OBSIDIAN_PERSONAL_VAULT_PATH does not exist: ${vaultPath}`);
        process.exit(0);
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
