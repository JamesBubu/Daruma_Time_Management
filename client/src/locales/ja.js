export default {
  app: {
    title: 'Daruma タスク管理',
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
    darkMode: 'ダークモード'
  },
  sidebar: {
    tasks: 'タスク',
    notes: 'セカンドブレイン',
    agents: 'エージェント'
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
