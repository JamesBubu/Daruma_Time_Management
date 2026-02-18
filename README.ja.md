# Daruma Dashboard

> **Vue 3 + Express** で構築したローカルファーストの個人管理ツール。タスク管理・セカンドブレイン（ノート）・AI エージェントランナーの3モジュールを統合。

**他言語の README：** [English](README.md) · [繁體中文](README.zh-TW.md)

---

## スクリーンショット

### タスク管理 — カンバンビュー
![カンバンタスクボード](docs/screenshots/landing.png)

### セカンドブレイン — Markdown ノート
![ノートリストとエディタ](docs/screenshots/second-brain.png)

### AI エージェント
![エージェントカードと実行コントロール](docs/screenshots/agents.png)

### 設定
![設定ページ](docs/screenshots/settings.png)

---

## 機能

### タスク管理
- 4種のビュー：**カンバン**・**リスト**・**カレンダー**・**タイムライン**
- 優先度・ステータス・タグ・日付範囲をサポート
- カンバンのドラッグ＆ドロップでステータス変更
- 高度なフィルター（検索・優先度・ステータス・タグ）

### セカンドブレイン（ノート）
- ノートは個別の **`.md` ファイル**として保存（YAML frontmatter付き）
- Markdown エディタ（ワンクリックでプレビュー切り替え）
- 自動保存の遅延を設定可能（デフォルト 800ms）
- タスク↔ノートの双方向リンク
- タスクカードにノートバックリンクバッジを表示、クリックで即移動

### AI エージェント
- カスタム System Prompt で AI エージェントを作成
- ローカルの `claude --print` CLI で実行（60 秒タイムアウト）
- 有効/無効の切り替え、インライン設定編集
- サンプル内蔵：要約アシスタント・コード解説・タスク分解

---

## アーキテクチャ

```
┌─────────────────────────────────────────────┐
│  ヘッダー（言語 / ダークモード / タスク追加）  │
├──────────┬──────────────────────────────────┤
│          │  Tasks  → カンバン / リスト /      │
│ サイドバー│           カレンダー / タイムライン  │
│ 60–240px │  セカンドブレイン → Markdown ノート │
│          │  Agents → Claude CLI ランナー      │
└──────────┴──────────────────────────────────┘
```

| 層 | 技術 |
|----|------|
| フロントエンド | Vue 3 (Composition API) + Pinia + Tailwind CSS |
| カレンダー | FullCalendar v6 |
| Markdown | marked v12 |
| アイコン | @heroicons/vue |
| バックエンド | Express.js (ESM) |
| ストレージ | ローカル JSON ファイル（git 管理外） |
| AI | Claude Code CLI (`claude --print`) |

---

## クイックスタート

### 必要環境
- Node.js 18+
- [Claude Code CLI](https://claude.ai/code) インストール済み・認証済み（エージェント機能に必要）

### インストール

```bash
# 1. Clone
git clone https://github.com/JamesBubu/Daruma_Time_Management.git
cd Daruma_Time_Management

# 2. ローカルデータファイルを初期化（git には含まれません）
cp server/data/tasks.example.json  server/data/tasks.json
cp server/data/notes.example.json  server/data/notes.json
cp server/data/agents.example.json server/data/agents.json

# 3. 依存パッケージをインストール
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 起動

```bash
# ターミナル 1 — バックエンド（ポート 3001）
cd server && npm run dev

# ターミナル 2 — フロントエンド（ポート 5173）
cd client && npm run dev
```

ブラウザで **http://localhost:5173** を開いてください。

---

## データとプライバシー

個人データ（タスク・ノート・エージェント設定）は `server/data/*.json` に保存され、`.gitignore` に追加されているため git にはコミットされません。

```
server/data/
├── tasks.json          ← 個人タスク（ローカルのみ）
├── notes.json          ← 個人ノート（ローカルのみ）
├── agents.json         ← エージェント設定（ローカルのみ）
├── tasks.example.json  ← 空テンプレート（コミット済み）
├── notes.example.json
└── agents.example.json
```

---

## API リファレンス

### Tasks
| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/tasks` | 全タスク取得 |
| POST | `/api/tasks` | タスク作成 |
| PUT | `/api/tasks/:id` | 更新 |
| DELETE | `/api/tasks/:id` | 削除 |
| GET | `/api/tags` | タグ一覧 |
| POST | `/api/tags` | タグ追加 |

### Notes
| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/notes` | 全ノート取得 |
| POST | `/api/notes` | ノート作成 |
| PUT | `/api/notes/:id` | 更新 |
| DELETE | `/api/notes/:id` | 削除（バックリンクを同期削除） |
| POST | `/api/notes/:id/link-task` | タスクと双方向リンク |
| DELETE | `/api/notes/:id/link-task/:taskId` | リンク解除 |

### Agents
| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/agents` | 全エージェント取得 |
| POST | `/api/agents` | 作成 |
| PUT | `/api/agents/:id` | 設定更新 |
| DELETE | `/api/agents/:id` | 削除 |
| POST | `/api/agents/:id/run` | 実行 — body: `{ "message": "..." }` |

---

## 言語サポート

- **English**（デフォルト）
- 繁體中文
- 日本語

設定は `localStorage` に保存され、ページリロード後も維持されます。
