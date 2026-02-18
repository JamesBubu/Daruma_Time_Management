export default {
  app: {
    title: 'Daruma Dashboard',
    loading: 'Loading...'
  },
  nav: {
    kanban: 'Kanban',
    list: 'List',
    calendar: 'Calendar',
    timeline: 'Timeline'
  },
  stats: {
    total: 'All Tasks',
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done'
  },
  filters: {
    search: 'Search tasks...',
    allPriority: 'All Priorities',
    allStatus: 'All Statuses',
    clearFilters: 'Clear Filters',
    tags: 'Tags:'
  },
  priority: {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  },
  status: {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done'
  },
  task: {
    addTask: 'Add Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    title: 'Title',
    titleRequired: 'Title *',
    titlePlaceholder: 'Enter task title',
    description: 'Description',
    descriptionPlaceholder: 'Enter task description',
    priorityLabel: 'Priority',
    statusLabel: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    tagsLabel: 'Tags',
    addTag: 'Add tag',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    edit: 'Edit',
    delete: 'Delete'
  },
  confirm: {
    deleteTitle: 'Confirm Delete',
    deleteMessage: 'Are you sure you want to delete this task? This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Delete'
  },
  kanban: {
    noTasks: 'No tasks'
  },
  list: {
    noTasks: 'No tasks match your filters',
    columns: {
      title: 'Title',
      priority: 'Priority',
      status: 'Status',
      startDate: 'Start Date',
      tags: 'Tags',
      actions: 'Actions'
    }
  },
  timeline: {
    tasks: 'Tasks',
    today: 'Today',
    noTasks: 'No tasks match your filters',
    legend: 'Priority:'
  },
  calendar: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day'
  },
  settings: {
    language: 'Language',
    darkMode: 'Dark Mode',
    save: 'Save',
    title: 'Settings',
    subtitle: 'Customize your Daruma Dashboard experience',
    appearance: {
      title: 'Appearance',
      defaultTaskView: 'Default Task View',
      defaultTaskViewDesc: 'The view shown when you open the Tasks section'
    },
    data: {
      title: 'Data Storage',
      resetDefaults: 'Reset to defaults',
      hint: 'Leave blank to use the default location (server/data/). Enter an absolute path to store files elsewhere.',
      pathPlaceholder: '/absolute/path/to/file.json',
      tasksFile: 'Tasks File',
      notesFile: 'Notes File',
      agentsFile: 'Agents File',
      test: 'Test',
      testing: 'Testing...',
      save: 'Save'
    },
    editor: {
      title: 'Editor',
      autosaveDelay: 'Autosave Delay',
      autosaveDelayDesc: 'How long to wait after you stop typing before saving',
      defaultMode: 'Default Mode',
      mode: {
        edit: 'Edit',
        preview: 'Preview'
      }
    },
    agent: {
      title: 'Agent Runner',
      timeout: 'Execution Timeout',
      timeoutDesc: 'Maximum time before an agent run is terminated'
    },
    docs: {
      title: 'Documentation',
      quickstart: 'Quick Start',
      markdown: 'Markdown',
      shortcuts: 'Shortcuts',
      qs: {
        step1: { title: 'Create a Task', desc: 'Click "+ Add Task" in the header to open the task form. Fill in a title and optionally set priority, dates, and tags.' },
        step2: { title: 'Organize with Kanban', desc: 'Drag and drop tasks between columns (To Do / In Progress / Done), or use the List, Calendar, and Timeline views.' },
        step3: { title: 'Write Notes', desc: 'Open Second Brain from the sidebar. Create notes with Markdown and link them to related tasks.' },
        step4: { title: 'Run an Agent', desc: 'Go to Agents, create an agent with a system prompt, then type a message and press Enter (or Run) to get a response from Claude CLI.' },
        step5: { title: 'Customize Storage', desc: 'In Settings → Data Storage, set custom file paths to store your data anywhere on your machine.' }
      },
      shortcuts: {
        agentRun: 'Run agent / send message',
        noteSave: 'Save note manually',
        closeModal: 'Close modal / cancel'
      }
    }
  },
  sidebar: {
    tasks: 'Tasks',
    notes: 'Second Brain',
    agents: 'Agents',
    settings: 'Settings'
  },
  notes: {
    title: 'Notes',
    new: 'New',
    empty: 'No notes yet. Click New to get started.',
    selectOrCreate: 'Select or create a note to get started'
  },
  agents: {
    title: 'Agents',
    description: 'Create AI agents to run automated tasks via Claude CLI',
    new: 'New Agent',
    empty: 'No agents yet. Click New Agent to get started.',
    createTitle: 'Create Agent',
    nameLabel: 'Name',
    namePlaceholder: 'Agent name',
    descLabel: 'Description',
    descPlaceholder: 'Briefly describe what this agent does',
    systemPromptLabel: 'System Prompt',
    systemPromptPlaceholder: 'Define the agent\'s role and behavior...'
  }
}
