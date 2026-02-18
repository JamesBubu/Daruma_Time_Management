import express from 'express';
import { readFileSync, writeFileSync, accessSync, constants } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { execFileSync } from 'child_process';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/agents.json');

function readData() {
  return JSON.parse(readFileSync(dataPath, 'utf-8'));
}

function writeData(data) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function generateNextId(agents) {
  let maxNum = 0;
  for (const agent of agents) {
    const match = agent.id.match(/^agent-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `agent-${String(maxNum + 1).padStart(5, '0')}`;
}

// Find claude binary path at startup
function findClaudePath() {
  // Try which command first
  try {
    return execFileSync('which', ['claude'], { encoding: 'utf-8' }).trim();
  } catch {}
  // Try common install paths
  const candidates = [
    `${process.env.HOME}/.local/bin/claude`,
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
    `${process.env.HOME}/.npm/bin/claude`,
    `${process.env.HOME}/.nvm/versions/node/current/bin/claude`,
  ];
  for (const p of candidates) {
    try { accessSync(p, constants.X_OK); return p; } catch {}
  }
  return 'claude';
}

const CLAUDE_PATH = findClaudePath();
console.log(`[agents] Using claude at: ${CLAUDE_PATH}`);

// Build child env: unset CLAUDECODE (prevent nested session error) and
// ANTHROPIC_API_KEY (invalid key causes auth failure; let claude use OAuth from ~/.claude/)
function buildChildEnv() {
  const env = { ...process.env };
  delete env.CLAUDECODE;
  delete env.ANTHROPIC_API_KEY;
  return env;
}

// GET all agents
router.get('/agents', (req, res) => {
  try {
    const data = readData();
    res.json(data.agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// POST new agent
router.post('/agents', (req, res) => {
  try {
    const data = readData();
    const newAgent = {
      id: generateNextId(data.agents),
      name: req.body.name || 'New Agent',
      description: req.body.description || '',
      systemPrompt: req.body.systemPrompt || '',
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.agents.push(newAgent);
    writeData(data);
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// PUT update agent
router.put('/agents/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.agents.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Agent not found' });
    data.agents[index] = {
      ...data.agents[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    res.json(data.agents[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// DELETE agent
router.delete('/agents/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.agents.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Agent not found' });
    data.agents.splice(index, 1);
    writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// POST run agent
router.post('/agents/:id/run', (req, res) => {
  try {
    const data = readData();
    const agent = data.agents.find(a => a.id === req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    if (!agent.enabled) return res.status(400).json({ error: 'Agent is disabled' });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const prompt = agent.systemPrompt
      ? `${agent.systemPrompt}\n\n${message}`
      : message;

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let responded = false;

    // Spawn claude: use resolved path, unset CLAUDECODE, pass prompt via stdin
    const child = spawn(CLAUDE_PATH, ['--print'], {
      shell: false,
      env: buildChildEnv(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Write prompt to stdin
    child.stdin.write(prompt);
    child.stdin.end();

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, 60000);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    child.on('close', (code) => {
      if (responded) return;
      responded = true;
      clearTimeout(timer);
      if (timedOut) return res.status(504).json({ error: 'Agent run timed out after 60 seconds' });
      if (code !== 0) return res.status(500).json({ error: 'Agent run failed', details: stderr || `exit code ${code}` });
      res.json({ output: stdout });
    });

    child.on('error', (err) => {
      if (responded) return;
      responded = true;
      clearTimeout(timer);
      res.status(500).json({
        error: `Failed to spawn claude (tried: ${CLAUDE_PATH}). Make sure claude CLI is installed.`,
        details: err.message
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run agent' });
  }
});

export default router;
