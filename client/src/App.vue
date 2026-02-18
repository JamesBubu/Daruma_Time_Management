<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm z-40 flex-shrink-0">
      <div class="px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <img src="/daruma.svg" alt="Daruma" class="w-10 h-10" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('app.title') }}</h1>
          </div>

          <!-- Right Controls -->
          <div class="flex items-center gap-2">
            <!-- Language Selector -->
            <select
              :value="locale"
              @change="setLocale($event.target.value)"
              class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option v-for="(name, code) in localeNames" :key="code" :value="code">
                {{ name }}
              </option>
            </select>

            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="t('settings.darkMode')"
            >
              <svg v-if="darkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            </button>

            <!-- Add Task Button (only in tasks section) -->
            <button
              v-if="activeSection === 'tasks'"
              @click="openTaskForm()"
              class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <span class="text-lg">+</span>
              <span class="hidden sm:inline">{{ t('task.addTask') }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Body: Sidebar + Main -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar
        :active-section="activeSection"
        :active-view="activeView"
        :is-collapsed="sidebarCollapsed"
        :t="t"
        @navigate="onNavigate"
        @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <!-- Tasks Section -->
        <template v-if="activeSection === 'tasks'">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Stats Bar (Clickable) -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div
                @click="goToListWithFilter('all')"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('stats.total') }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.total }}</p>
              </div>
              <div
                @click="goToListWithFilter('todo')"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('stats.todo') }}</p>
                <p class="text-2xl font-bold text-gray-500 dark:text-gray-300">{{ taskStats.todo }}</p>
              </div>
              <div
                @click="goToListWithFilter('in-progress')"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('stats.inProgress') }}</p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ taskStats.inProgress }}</p>
              </div>
              <div
                @click="goToListWithFilter('done')"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('stats.done') }}</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ taskStats.done }}</p>
              </div>
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
              <div class="flex flex-wrap items-center gap-4">
                <!-- Search -->
                <div class="flex-1 min-w-[200px]">
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('filters.search')"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <!-- Priority Filter -->
                <select
                  v-model="filterPriority"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">{{ t('filters.allPriority') }}</option>
                  <option value="high">{{ t('priority.high') }}</option>
                  <option value="medium">{{ t('priority.medium') }}</option>
                  <option value="low">{{ t('priority.low') }}</option>
                </select>

                <!-- Status Filter -->
                <select
                  v-model="filterStatus"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">{{ t('filters.allStatus') }}</option>
                  <option value="todo">{{ t('status.todo') }}</option>
                  <option value="in-progress">{{ t('status.in-progress') }}</option>
                  <option value="done">{{ t('status.done') }}</option>
                </select>

                <!-- Clear Filters -->
                <button
                  v-if="hasActiveFilters"
                  @click="clearFilters"
                  class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {{ t('filters.clearFilters') }}
                </button>
              </div>

              <!-- Tags Filter -->
              <div v-if="tags.length > 0" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('filters.tags') }}</span>
                <button
                  v-for="tag in tags"
                  :key="tag"
                  @click="toggleTagFilter(tag)"
                  :class="[
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    filterTags.includes(tag)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- View Content -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>

            <template v-else>
              <!-- Kanban View -->
              <div v-if="activeView === 'kanban'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="column in kanbanColumns"
                  :key="column.status"
                  :class="[column.bgClass, column.darkBgClass, 'rounded-xl p-4']"
                  @dragover.prevent
                  @drop="handleDrop($event, column.status)"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <span :class="'w-3 h-3 rounded-full ' + column.dotClass"></span>
                      {{ t(`status.${column.status}`) }}
                      <span class="text-sm text-gray-400">({{ getTasksByStatus(column.status).length }})</span>
                    </h3>
                  </div>
                  <div class="space-y-3 min-h-[200px]">
                    <div
                      v-for="task in getTasksByStatus(column.status)"
                      :key="task.id"
                      draggable="true"
                      @dragstart="handleDragStart($event, task)"
                      @click="openTaskForm(task)"
                      :class="[
                        'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-grab hover:shadow-md transition-shadow',
                        'border-l-4',
                        task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                      ]"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-mono text-gray-400 dark:text-gray-500">{{ task.id }}</span>
                        <button
                          @click.stop="confirmDelete(task.id)"
                          class="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ task.title }}</h4>
                      <p v-if="task.description" class="text-gray-500 dark:text-gray-400 text-xs mt-2 line-clamp-2">
                        {{ task.description }}
                      </p>
                      <div class="flex items-center gap-2 mt-3 flex-wrap">
                        <span
                          v-for="tag in task.tags"
                          :key="tag"
                          class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                          {{ tag }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-2">
                          <span class="text-xs text-gray-400">{{ formatDate(task.startDate) }}</span>
                          <!-- Note backlink badge -->
                          <span
                            v-if="task.linkedNotes && task.linkedNotes.length > 0"
                            class="flex items-center gap-0.5 text-xs text-blue-500 dark:text-blue-400"
                            title="相關筆記"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {{ task.linkedNotes.length }}
                          </span>
                        </div>
                        <span
                          :class="[
                            'px-2 py-0.5 text-xs rounded-full font-medium',
                            task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          ]"
                        >
                          {{ t(`priority.${task.priority}`) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- List View -->
              <div v-else-if="activeView === 'list'" class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.title') }}</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.priority') }}</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.status') }}</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.startDate') }}</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.tags') }}</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">筆記</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{{ t('list.columns.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-6 py-4">
                        <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ task.id }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="font-medium text-gray-900 dark:text-white">{{ task.title }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span :class="['px-2 py-1 text-xs rounded-full', task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300']">
                          {{ t(`priority.${task.priority}`) }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span :class="['px-2 py-1 text-xs rounded-full', task.status === 'todo' ? 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' : task.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300']">
                          {{ t(`status.${task.status}`) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(task.startDate) }}</td>
                      <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-1">
                          <span v-for="tag in task.tags" :key="tag" class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {{ tag }}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span
                          v-if="task.linkedNotes && task.linkedNotes.length > 0"
                          @click="openTaskForm(task)"
                          class="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
                          title="點擊查看相關筆記"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {{ task.linkedNotes.length }}
                        </span>
                        <span v-else class="text-xs text-gray-300 dark:text-gray-600">—</span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button @click="openTaskForm(task)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">{{ t('task.edit') }}</button>
                        <button @click="confirmDelete(task.id)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">{{ t('task.delete') }}</button>
                      </td>
                    </tr>
                    <tr v-if="filteredTasks.length === 0">
                      <td colspan="7" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">{{ t('list.noTasks') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Calendar View -->
              <div v-else-if="activeView === 'calendar'" class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                <CalendarView :tasks="filteredTasks" :locale="locale" :t="t" @edit="openTaskForm" />
              </div>

              <!-- Timeline View -->
              <div v-else-if="activeView === 'timeline'" class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <TimelineView :tasks="filteredTasks" :t="t" :locale="locale" @edit="openTaskForm" />
              </div>
            </template>
          </div>
        </template>

        <!-- Second Brain Section -->
        <NotesView
          v-else-if="activeSection === 'notes'"
          :tasks="tasks"
          :t="t"
          class="h-full"
        />

        <!-- Agents Section -->
        <AgentsView
          v-else-if="activeSection === 'agents'"
          :t="t"
        />
      </main>
    </div>

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showTaskForm"
      :task="editingTask"
      :tags="tags"
      :notes="notesStore.notes"
      :t="t"
      @close="closeTaskForm"
      @save="saveTask"
      @add-tag="addTag"
      @navigate-to-note="navigateToNote"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('confirm.deleteTitle') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ t('confirm.deleteMessage') }}</p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {{ t('confirm.cancel') }}
          </button>
          <button
            @click="deleteTask"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {{ t('confirm.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettings } from './composables/useSettings.js'
import { useNotesStore } from './stores/notesStore.js'
import TaskForm from './components/TaskForm.vue'
import CalendarView from './components/CalendarView.vue'
import TimelineView from './components/TimelineView.vue'
import Sidebar from './components/Sidebar.vue'
import NotesView from './components/SecondBrain/NotesView.vue'
import AgentsView from './components/Agents/AgentsView.vue'

const { locale, darkMode, localeNames, t, setLocale, toggleDarkMode } = useSettings()
const notesStore = useNotesStore()

const API_BASE = '/api'

// Data
const tasks = ref([])
const tags = ref([])
const isLoading = ref(true)

// Layout state
const activeSection = ref('tasks')
const activeView = ref('kanban')
const sidebarCollapsed = ref(false)

// Filter state
const searchQuery = ref('')
const filterPriority = ref('all')
const filterStatus = ref('all')
const filterTags = ref([])

// Form state
const showTaskForm = ref(false)
const editingTask = ref(null)

// Delete state
const showDeleteConfirm = ref(false)
const taskToDelete = ref(null)

// Drag state
const draggedTask = ref(null)

const kanbanColumns = [
  { status: 'todo', bgClass: 'bg-gray-50', darkBgClass: 'dark:bg-gray-800/50', dotClass: 'bg-gray-400' },
  { status: 'in-progress', bgClass: 'bg-blue-50', darkBgClass: 'dark:bg-blue-900/20', dotClass: 'bg-blue-500' },
  { status: 'done', bgClass: 'bg-green-50', darkBgClass: 'dark:bg-green-900/20', dotClass: 'bg-green-500' }
]

// Computed
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    if (filterStatus.value !== 'all' && task.status !== filterStatus.value) return false
    if (filterPriority.value !== 'all' && task.priority !== filterPriority.value) return false
    if (filterTags.value.length > 0 && !filterTags.value.some(tag => task.tags?.includes(tag))) return false
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)
    }
    return true
  })
})

const taskStats = computed(() => ({
  total: tasks.value.length,
  todo: tasks.value.filter(t => t.status === 'todo').length,
  inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
  done: tasks.value.filter(t => t.status === 'done').length
}))

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || filterPriority.value !== 'all' || filterStatus.value !== 'all' || filterTags.value.length > 0
})

// Navigation
function onNavigate({ section, view }) {
  activeSection.value = section
  if (view) activeView.value = view
}

function navigateToNote(noteId) {
  closeTaskForm()
  activeSection.value = 'notes'
  notesStore.selectNote(noteId)
}

// Methods
function getTasksByStatus(status) {
  return filteredTasks.value.filter(t => t.status === status)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'zh-TW', { month: 'short', day: 'numeric' })
}

function goToListWithFilter(status) {
  activeSection.value = 'tasks'
  activeView.value = 'list'
  filterStatus.value = status
}

function toggleTagFilter(tag) {
  const index = filterTags.value.indexOf(tag)
  if (index === -1) {
    filterTags.value.push(tag)
  } else {
    filterTags.value.splice(index, 1)
  }
}

function clearFilters() {
  searchQuery.value = ''
  filterPriority.value = 'all'
  filterStatus.value = 'all'
  filterTags.value = []
}

function openTaskForm(task = null) {
  editingTask.value = task
  showTaskForm.value = true
}

function closeTaskForm() {
  showTaskForm.value = false
  editingTask.value = null
}

// Drag and Drop
function handleDragStart(event, task) {
  draggedTask.value = task
  event.dataTransfer.effectAllowed = 'move'
}

async function handleDrop(event, newStatus) {
  event.preventDefault()
  if (!draggedTask.value || draggedTask.value.status === newStatus) {
    draggedTask.value = null
    return
  }

  try {
    const res = await fetch(`${API_BASE}/tasks/${draggedTask.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    const updated = await res.json()
    const index = tasks.value.findIndex(t => t.id === draggedTask.value.id)
    if (index !== -1) tasks.value[index] = updated
  } catch (err) {
    console.error('Error updating task status:', err)
  }
  draggedTask.value = null
}

async function saveTask(taskData) {
  try {
    if (editingTask.value) {
      const res = await fetch(`${API_BASE}/tasks/${editingTask.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      const updated = await res.json()
      const index = tasks.value.findIndex(t => t.id === editingTask.value.id)
      if (index !== -1) tasks.value[index] = updated
    } else {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      const newTask = await res.json()
      tasks.value.push(newTask)
    }
    closeTaskForm()
  } catch (err) {
    console.error('Error saving task:', err)
  }
}

function confirmDelete(taskId) {
  taskToDelete.value = taskId
  showDeleteConfirm.value = true
}

async function deleteTask() {
  try {
    await fetch(`${API_BASE}/tasks/${taskToDelete.value}`, { method: 'DELETE' })
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value)
    showDeleteConfirm.value = false
    taskToDelete.value = null
  } catch (err) {
    console.error('Error deleting task:', err)
  }
}

async function addTag(tag) {
  try {
    const res = await fetch(`${API_BASE}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    })
    tags.value = await res.json()
  } catch (err) {
    console.error('Error adding tag:', err)
  }
}

// Init
onMounted(async () => {
  try {
    const [tasksRes, tagsRes] = await Promise.all([
      fetch(`${API_BASE}/tasks`),
      fetch(`${API_BASE}/tags`)
    ])
    tasks.value = await tasksRes.json()
    tags.value = await tagsRes.json()
  } catch (err) {
    console.error('Error loading data:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
