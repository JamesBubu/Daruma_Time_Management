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
function resolveFile(customPath, filename) {
  if (customPath && isAbsolute(customPath)) return customPath;
  return join(DATA_DIR, filename);
}

export function getDataPaths() {
  const s = readSettings();
  return {
    tasks:        resolveFile(s.paths?.tasks,  'tasks.json'),
    agents:       resolveFile(s.paths?.agents, 'agents.json'),
    // notesLegacy: old single-file path used for migration detection
    notesLegacy:  join(DATA_DIR, 'notes.json'),
  };
}

// Notes are stored as individual .md files in a directory
export function getNotesDir() {
  const s = readSettings();
  const custom = s.paths?.notes;
  if (custom && isAbsolute(custom)) return custom;
  return join(DATA_DIR, 'notes');
}

export function getAgentTimeout() {
  const s = readSettings();
  return (s.agent?.timeout || 60) * 1000;
}
