# Daruma Dashboard

> A local-first personal management tool built with **Vue 3 + Express**, featuring three integrated modules: Task Manager, Second Brain (notes), and AI Agent runner.

**README also available in:** [繁體中文](README.zh-TW.md) · [日本語](README.ja.md)

---

## Features

### Task Manager
- Four views: **Kanban**, **List**, **Calendar**, **Timeline**
- Priority, status, tags, and date ranges per task
- Drag-and-drop between Kanban columns
- Advanced filters: search, priority, status, tags

### Second Brain (Notes)
- Markdown editor with one-click preview toggle
- 800ms debounce auto-save
- Bidirectional task ↔ note linking
- Note backlink badges on task cards; click to navigate

### AI Agents
- Create agents with custom System Prompts
- Runs locally via `claude --print` CLI (60-second timeout)
- Enable/disable toggle, inline edit settings
- Built-in examples: Summarizer, Code Explainer, Task Decomposer

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  Header  (language / dark mode / add task)  │
├──────────┬──────────────────────────────────┤
│          │  Tasks  → Kanban / List /         │
│ Sidebar  │           Calendar / Timeline     │
│ 60–240px │  Second Brain → Markdown notes    │
│          │  Agents → Claude CLI runner       │
└──────────┴──────────────────────────────────┘
```

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 (Composition API) + Pinia + Tailwind CSS |
| Calendar | FullCalendar v6 |
| Markdown | marked v12 |
| Icons | @heroicons/vue |
| Backend | Express.js (ESM) |
| Storage | Local JSON files (never committed) |
| AI | Claude Code CLI (`claude --print`) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- [Claude Code CLI](https://claude.ai/code) installed and authenticated *(for Agent feature)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JamesBubu/Daruma_Time_Management.git
cd Daruma_Time_Management

# 2. Initialize local data files (kept out of git)
cp server/data/tasks.example.json  server/data/tasks.json
cp server/data/notes.example.json  server/data/notes.json
cp server/data/agents.example.json server/data/agents.json

# 3. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Start

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Data & Privacy

Personal data (tasks, notes, agent configs) is stored in `server/data/*.json` and listed in `.gitignore` — it is never committed to git.

```
server/data/
├── tasks.json          ← your tasks  (local only)
├── notes.json          ← your notes  (local only)
├── agents.json         ← your agents (local only)
├── tasks.example.json  ← empty template (committed)
├── notes.example.json
└── agents.example.json
```

---

## API Reference

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tags` | List all tags |
| POST | `/api/tags` | Add a tag |

### Notes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note (clears backlinks) |
| POST | `/api/notes/:id/link-task` | Link note ↔ task |
| DELETE | `/api/notes/:id/link-task/:taskId` | Unlink |

### Agents
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/agents` | List all agents |
| POST | `/api/agents` | Create agent |
| PUT | `/api/agents/:id` | Update agent |
| DELETE | `/api/agents/:id` | Delete agent |
| POST | `/api/agents/:id/run` | Run agent — body: `{ "message": "..." }` |

---

## Language Support

- **English** (default)
- 繁體中文
- 日本語

Preferences are saved to `localStorage` and persist across sessions.
