import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DATA_DIR = join(__dirname, '../data');
export const SETTINGS_PATH = join(DATA_DIR, 'settings.json');

const DEFAULTS = {
  paths: { tasks: '', notes: '', agents: '' },
  agent: { timeout: 60 }
};

export function readSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(readFileSync(SETTINGS_PATH, 'utf-8')) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeSettings(settings) {
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

// Resolve a custom path or fall back to default filename in DATA_DIR
function resolve(customPath, filename) {
  if (customPath && isAbsolute(customPath)) return customPath;
  return join(DATA_DIR, filename);
}

export function getDataPaths() {
  const s = readSettings();
  return {
    tasks:  resolve(s.paths?.tasks,  'tasks.json'),
    notes:  resolve(s.paths?.notes,  'notes.json'),
    agents: resolve(s.paths?.agents, 'agents.json'),
  };
}

export function getAgentTimeout() {
  const s = readSettings();
  return (s.agent?.timeout || 60) * 1000;
}
