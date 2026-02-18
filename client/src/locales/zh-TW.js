export default {
  app: {
    title: 'Daruma Dashboard',
    loading: '載入中...'
  },
  nav: {
    kanban: '看板',
    list: '列表',
    calendar: '日曆',
    timeline: '時間軸'
  },
  stats: {
    total: '全部任務',
    todo: '待辦',
    inProgress: '進行中',
    done: '完成'
  },
  filters: {
    search: '搜尋任務...',
    allPriority: '所有優先順序',
    allStatus: '所有狀態',
    clearFilters: '清除篩選',
    tags: '標籤:'
  },
  priority: {
    high: '高',
    medium: '中',
    low: '低'
  },
  status: {
    todo: '待辦',
    'in-progress': '進行中',
    done: '完成'
  },
  task: {
    addTask: '新增任務',
    editTask: '編輯任務',
    deleteTask: '刪除任務',
    title: '標題',
    titleRequired: '標題 *',
    titlePlaceholder: '輸入任務標題',
    description: '描述',
    descriptionPlaceholder: '輸入任務描述',
    priorityLabel: '優先順序',
    statusLabel: '狀態',
    startDate: '開始日期',
    endDate: '結束日期',
    tagsLabel: '標籤',
    addTag: '新增標籤',
    cancel: '取消',
    create: '建立',
    update: '更新',
    edit: '編輯',
    delete: '刪除'
  },
  confirm: {
    deleteTitle: '確認刪除',
    deleteMessage: '確定要刪除這個任務嗎？此操作無法復原。',
    cancel: '取消',
    confirm: '刪除'
  },
  kanban: {
    noTasks: '沒有任務'
  },
  list: {
    noTasks: '沒有符合條件的任務',
    columns: {
      title: '標題',
      priority: '優先順序',
      status: '狀態',
      startDate: '開始日期',
      tags: '標籤',
      actions: '操作'
    }
  },
  timeline: {
    tasks: '任務',
    today: '今天',
    noTasks: '沒有符合條件的任務',
    legend: '優先順序:'
  },
  calendar: {
    today: '今天',
    month: '月',
    week: '週',
    day: '日'
  },
  settings: {
    language: '語言',
    darkMode: '深色模式'
  },
  sidebar: {
    tasks: '任務',
    notes: '第二大腦',
    agents: '代理人'
  },
  notes: {
    title: '筆記',
    new: '新增',
    empty: '尚無筆記，點擊新增開始',
    selectOrCreate: '選擇或建立筆記開始'
  },
  agents: {
    title: '代理人',
    description: '建立 AI 代理人執行自動化任務',
    new: '新增代理人',
    empty: '尚無代理人，點擊新增開始',
    createTitle: '建立代理人',
    nameLabel: '名稱',
    namePlaceholder: '代理人名稱',
    descLabel: '描述',
    descPlaceholder: '簡短描述此代理人的用途',
    systemPromptLabel: 'System Prompt',
    systemPromptPlaceholder: '設定代理人的角色和行為...'
  }
}
