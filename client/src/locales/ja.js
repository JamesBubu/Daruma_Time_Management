export default {
  app: {
    title: 'Daruma Dashboard',
    loading: '読み込み中...'
  },
  nav: {
    kanban: 'カンバン',
    list: 'リスト',
    calendar: 'カレンダー',
    timeline: 'タイムライン'
  },
  stats: {
    total: '全タスク',
    todo: '未着手',
    inProgress: '進行中',
    done: '完了'
  },
  filters: {
    search: 'タスクを検索...',
    allPriority: 'すべての優先度',
    allStatus: 'すべてのステータス',
    clearFilters: 'フィルターをクリア',
    tags: 'タグ:'
  },
  priority: {
    high: '高',
    medium: '中',
    low: '低'
  },
  status: {
    todo: '未着手',
    'in-progress': '進行中',
    done: '完了'
  },
  task: {
    addTask: 'タスク追加',
    editTask: 'タスク編集',
    deleteTask: 'タスク削除',
    title: 'タイトル',
    titleRequired: 'タイトル *',
    titlePlaceholder: 'タスクのタイトルを入力',
    description: '説明',
    descriptionPlaceholder: 'タスクの説明を入力',
    priorityLabel: '優先度',
    statusLabel: 'ステータス',
    startDate: '開始日',
    endDate: '終了日',
    tagsLabel: 'タグ',
    addTag: 'タグを追加',
    cancel: 'キャンセル',
    create: '作成',
    update: '更新',
    edit: '編集',
    delete: '削除'
  },
  confirm: {
    deleteTitle: '削除の確認',
    deleteMessage: 'このタスクを削除してもよろしいですか？この操作は元に戻せません。',
    cancel: 'キャンセル',
    confirm: '削除'
  },
  kanban: {
    noTasks: 'タスクがありません'
  },
  list: {
    noTasks: '条件に一致するタスクがありません',
    columns: {
      title: 'タイトル',
      priority: '優先度',
      status: 'ステータス',
      startDate: '開始日',
      tags: 'タグ',
      actions: '操作'
    }
  },
  timeline: {
    tasks: 'タスク',
    today: '今日',
    noTasks: '条件に一致するタスクがありません',
    legend: '優先度:'
  },
  calendar: {
    today: '今日',
    month: '月',
    week: '週',
    day: '日'
  },
  settings: {
    language: '言語',
    darkMode: 'ダークモード',
    save: '保存',
    title: '設定',
    subtitle: 'Daruma Dashboard をカスタマイズ',
    appearance: {
      title: '外観',
      defaultTaskView: 'デフォルトタスクビュー',
      defaultTaskViewDesc: 'タスクセクションを開いたときに表示されるビュー'
    },
    data: {
      title: 'データストレージ',
      resetDefaults: 'デフォルトに戻す',
      hint: '空白のままにするとデフォルト（server/data/）が使用されます。絶対パスを入力すると別の場所に保存できます。',
      pathPlaceholder: '/絶対/パス/ファイル.json',
      dirPlaceholder: '/絶対/パス/フォルダ/',
      tasksFile: 'タスクファイル',
      notesDir: 'ノートフォルダ',
      notesDirDesc: '1ノート1ファイルの .md 形式（frontmatter付き）',
      agentsFile: 'エージェントファイル',
      test: 'テスト',
      testing: 'テスト中...',
      save: '保存'
    },
    editor: {
      title: 'エディタ',
      autosaveDelay: '自動保存の遅延',
      autosaveDelayDesc: '入力を止めてから保存するまでの時間',
      defaultMode: 'デフォルトモード',
      mode: {
        edit: '編集',
        preview: 'プレビュー'
      }
    },
    agent: {
      title: 'エージェントランナー',
      timeout: '実行タイムアウト',
      timeoutDesc: 'エージェント実行の最大時間'
    },
    docs: {
      title: 'ドキュメント',
      quickstart: 'クイックスタート',
      markdown: 'Markdown',
      shortcuts: 'ショートカット',
      qs: {
        step1: { title: 'タスクを作成', desc: 'ヘッダーの「タスク追加」をクリックしてフォームを開き、タイトルと優先度・日付・タグを設定します。' },
        step2: { title: 'カンバンで管理', desc: 'タスクをドラッグ＆ドロップで列（未着手/進行中/完了）に移動するか、リスト・カレンダー・タイムラインビューを使います。' },
        step3: { title: 'ノートを書く', desc: 'サイドバーからセカンドブレインを開き、Markdownでノートを書いて関連タスクにリンクします。' },
        step4: { title: 'エージェントを実行', desc: 'エージェントページでシステムプロンプトを設定し、メッセージを入力してEnter（または実行）でClaude CLIを呼び出します。' },
        step5: { title: 'ストレージをカスタマイズ', desc: '設定 → データストレージでカスタムパスを設定し、データをPC上の任意の場所に保存できます。' }
      },
      shortcuts: {
        agentRun: 'エージェント実行 / メッセージ送信',
        noteSave: 'ノートを手動保存',
        closeModal: 'モーダルを閉じる / キャンセル'
      }
    }
  },
  sidebar: {
    tasks: 'タスク',
    notes: 'セカンドブレイン',
    agents: 'エージェント',
    settings: '設定'
  },
  notes: {
    title: 'ノート',
    new: '新規',
    empty: 'ノートがありません。新規追加してください',
    selectOrCreate: 'ノートを選択または作成してください'
  },
  agents: {
    title: 'エージェント',
    description: 'AIエージェントで自動化タスクを実行',
    new: 'エージェント追加',
    empty: 'エージェントがありません。新規追加してください',
    createTitle: 'エージェント作成',
    nameLabel: '名前',
    namePlaceholder: 'エージェント名',
    descLabel: '説明',
    descPlaceholder: 'このエージェントの用途の説明',
    systemPromptLabel: 'システムプロンプト',
    systemPromptPlaceholder: 'エージェントの役割と動作を設定...'
  }
}
