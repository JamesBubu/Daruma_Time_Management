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
    darkMode: 'Dark Mode'
  },
  sidebar: {
    tasks: 'Tasks',
    notes: 'Second Brain',
    agents: 'Agents'
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
