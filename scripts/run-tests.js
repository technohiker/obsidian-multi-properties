
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jestPath = path.resolve(__dirname, '../node_modules/.bin/jest');

const installPluginScript = path.resolve(__dirname, 'install-plugin-test.mjs');
const installProcess = spawn('node', [installPluginScript], {
  stdio: 'inherit',
  shell: true,
});

installProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Plugin installed successfully, running tests...');
    const testProcess = spawn(jestPath, {
      stdio: 'inherit',
      shell: true,
    });

    testProcess.on('close', (testCode) => {
      process.exit(testCode);
    });
  } else {
    console.error('Plugin installation failed, aborting tests.');
    process.exit(code);
  }
});
