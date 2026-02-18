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
    darkMode: '深色模式',
    save: '儲存',
    title: '設定',
    subtitle: '自訂你的 Daruma Dashboard 使用體驗',
    appearance: {
      title: '外觀',
      defaultTaskView: '預設任務視圖',
      defaultTaskViewDesc: '進入任務區塊時預設顯示的視圖'
    },
    data: {
      title: '資料儲存',
      resetDefaults: '還原預設',
      hint: '留空則使用預設位置（server/data/）。輸入絕對路徑可將檔案儲存在其他位置。',
      pathPlaceholder: '/絕對/路徑/到/檔案.json',
      dirPlaceholder: '/絕對/路徑/到/資料夾/',
      tasksFile: '任務檔案',
      notesDir: '筆記資料夾',
      notesDirDesc: '每篇筆記一個 .md 檔案（含 frontmatter）',
      agentsFile: '代理人檔案',
      test: '測試',
      testing: '測試中...',
      save: '儲存'
    },
    editor: {
      title: '編輯器',
      autosaveDelay: '自動儲存延遲',
      autosaveDelayDesc: '停止輸入後多久自動儲存',
      defaultMode: '預設模式',
      mode: {
        edit: '編輯',
        preview: '預覽'
      }
    },
    agent: {
      title: '代理人執行器',
      timeout: '執行逾時',
      timeoutDesc: '代理人執行的最長時間'
    },
    docs: {
      title: '說明文件',
      quickstart: '快速上手',
      markdown: 'Markdown',
      shortcuts: '快捷鍵',
      qs: {
        step1: { title: '建立任務', desc: '點擊頂部的「新增任務」按鈕開啟表單，填入標題並設定優先順序、日期和標籤。' },
        step2: { title: '看板管理', desc: '拖曳任務到不同欄位（待辦 / 進行中 / 完成），或切換到列表、日曆、時間軸視圖。' },
        step3: { title: '撰寫筆記', desc: '從側邊欄開啟第二大腦，用 Markdown 撰寫筆記並與相關任務建立連結。' },
        step4: { title: '執行代理人', desc: '前往代理人頁面，建立有系統提示的代理人，輸入訊息後按 Enter（或執行）呼叫 Claude CLI。' },
        step5: { title: '自訂儲存位置', desc: '在設定 → 資料儲存中，設定自訂路徑將資料存在電腦的任何位置。' }
      },
      shortcuts: {
        agentRun: '執行代理人 / 送出訊息',
        noteSave: '手動儲存筆記',
        closeModal: '關閉對話框 / 取消'
      }
    }
  },
  sidebar: {
    tasks: '任務',
    notes: '第二大腦',
    agents: '代理人',
    settings: '設定'
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
