# Daruma — 個人綜合管理工具

> 一個以 **Vue 3 + Express** 為核心的本地端個人管理工具，包含三大模組：任務管理、第二大腦筆記、AI Agent 執行器。

## 功能模組

### 任務管理
- 四種視角：**看板**（Kanban）、**列表**、**日曆**、**時間軸**
- 任務支援優先度、狀態、標籤、日期區間
- Kanban 拖拉改變狀態
- 進階篩選（搜尋、優先度、狀態、標籤）

### 第二大腦（筆記）
- Markdown 編輯器，支援即時預覽切換
- 800ms debounce 自動儲存
- 任務↔筆記雙向關聯，任務卡顯示筆記 backlink

### AI Agent 執行器
- 建立自訂 System Prompt 的 AI 代理人
- 呼叫本機 `claude --print` CLI 執行，60 秒 timeout
- 支援啟用/停用、inline 編輯設定
- 內建範例 Agent（摘要助手、程式碼解說、任務分解）

## 技術架構

```
┌─────────────────────────────────────────┐
│  Header（語言切換 / 深色模式 / 新增任務）  │
├──────┬──────────────────────────────────┤
│      │   Tasks  → Kanban / List /       │
│Sidebar   Calendar / Timeline            │
│      │   Second Brain → Markdown 筆記   │
│      │   Agents → Claude CLI 執行器      │
└──────┴──────────────────────────────────┘
```

| 層 | 技術 |
|----|------|
| Frontend | Vue 3 (Composition API) + Pinia + Tailwind CSS |
| Routing/Layout | Sidebar 收合導航（60px / 240px） |
| Calendar | FullCalendar v6 |
| Markdown | marked v12 |
| Icons | @heroicons/vue |
| Backend | Express.js (ESM) |
| Storage | JSON files（本機，不上傳） |
| AI | Claude Code CLI (`claude --print`) |

## 快速開始

### 前置需求
- Node.js 18+
- [Claude Code CLI](https://claude.ai/code) 已安裝並登入（Agent 功能需要）

### 安裝

```bash
# Clone
git clone https://github.com/JamesBubu/Daruma_Time_Management.git
cd Daruma_Time_Management

# 初始化資料檔（個人資料保存在本機，不進入 git）
cp server/data/tasks.example.json server/data/tasks.json
cp server/data/notes.example.json server/data/notes.json
cp server/data/agents.example.json server/data/agents.json

# 安裝 server 依賴
cd server && npm install && cd ..

# 安裝 client 依賴
cd client && npm install && cd ..
```

### 啟動

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

瀏覽器開啟 http://localhost:5173

## 資料儲存說明

個人資料（任務、筆記、Agent 設定）儲存在 `server/data/*.json`，已加入 `.gitignore`，不會被 commit。

```
server/data/
├── tasks.json       ← 個人任務（本機）
├── notes.json       ← 個人筆記（本機）
├── agents.json      ← Agent 設定（本機）
├── tasks.example.json   ← 範本，commit 用
├── notes.example.json
└── agents.example.json
```

## API 端點

### Tasks
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/tasks` | 列出全部 |
| POST | `/api/tasks` | 建立任務 |
| PUT | `/api/tasks/:id` | 更新 |
| DELETE | `/api/tasks/:id` | 刪除 |

### Notes
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/notes` | 列出全部 |
| POST | `/api/notes` | 建立筆記 |
| PUT | `/api/notes/:id` | 更新 |
| DELETE | `/api/notes/:id` | 刪除（同步清除 task backlink） |
| POST | `/api/notes/:id/link-task` | 雙向關聯任務 |
| DELETE | `/api/notes/:id/link-task/:taskId` | 解除關聯 |

### Agents
| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/agents` | 列出全部 |
| POST | `/api/agents` | 建立 |
| PUT | `/api/agents/:id` | 更新設定 |
| DELETE | `/api/agents/:id` | 刪除 |
| POST | `/api/agents/:id/run` | 執行（body: `{ message }`） |

## 語言支援

- 繁體中文（預設）
- 日本語

設定儲存於 `localStorage`，重整後保留。
