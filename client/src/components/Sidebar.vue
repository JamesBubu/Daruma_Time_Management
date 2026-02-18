<template>
  <aside
    :class="[
      'flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex-shrink-0',
      isCollapsed ? 'w-16' : 'w-60'
    ]"
  >
    <!-- Toggle button -->
    <div class="flex items-center justify-end px-2 py-3 border-b border-gray-200 dark:border-gray-700">
      <button
        @click="$emit('toggle-collapse')"
        class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        :title="isCollapsed ? '展開' : '收合'"
      >
        <ChevronDoubleLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
        <ChevronDoubleRightIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-2 flex flex-col">
      <!-- Tasks Section -->
      <div class="mb-1">
        <button
          @click="toggleSection('tasks')"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
            activeSection === 'tasks'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <ClipboardDocumentListIcon class="w-5 h-5 flex-shrink-0" />
          <span v-show="!isCollapsed" class="text-sm font-semibold flex-1">{{ t('sidebar.tasks') }}</span>
          <ChevronDownIcon
            v-show="!isCollapsed"
            :class="['w-4 h-4 transition-transform', expandedSections.tasks ? 'rotate-180' : '']"
          />
        </button>

        <!-- Task sub-views -->
        <div v-show="!isCollapsed && expandedSections.tasks" class="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">
          <button
            v-for="view in taskViews"
            :key="view.id"
            @click="$emit('navigate', { section: 'tasks', view: view.id })"
            :class="[
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              activeSection === 'tasks' && activeView === view.id
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <component :is="view.icon" class="w-4 h-4 flex-shrink-0" />
            <span>{{ t(`nav.${view.id}`) }}</span>
          </button>
        </div>

        <!-- Collapsed task icon shortcut -->
        <div v-show="isCollapsed" class="flex flex-col items-center gap-1 mt-1">
          <button
            v-for="view in taskViews"
            :key="view.id"
            @click="$emit('navigate', { section: 'tasks', view: view.id })"
            :class="[
              'p-2 rounded-lg transition-colors',
              activeSection === 'tasks' && activeView === view.id
                ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :title="t(`nav.${view.id}`)"
          >
            <component :is="view.icon" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Second Brain Section -->
      <div class="mb-1">
        <button
          @click="$emit('navigate', { section: 'notes' })"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
            activeSection === 'notes'
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          :title="t('sidebar.notes')"
        >
          <BookOpenIcon class="w-5 h-5 flex-shrink-0" />
          <span v-show="!isCollapsed" class="text-sm font-semibold">{{ t('sidebar.notes') }}</span>
        </button>
      </div>

      <!-- Agents Section -->
      <div class="mb-1">
        <button
          @click="$emit('navigate', { section: 'agents' })"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
            activeSection === 'agents'
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          :title="t('sidebar.agents')"
        >
          <CpuChipIcon class="w-5 h-5 flex-shrink-0" />
          <span v-show="!isCollapsed" class="text-sm font-semibold">{{ t('sidebar.agents') }}</span>
        </button>
      </div>

      <!-- Settings (pinned at bottom) -->
      <div class="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700 mb-1">
        <button
          @click="$emit('navigate', { section: 'settings' })"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
            activeSection === 'settings'
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
          :title="t('sidebar.settings')"
        >
          <Cog6ToothIcon class="w-5 h-5 flex-shrink-0" />
          <span v-show="!isCollapsed" class="text-sm font-semibold">{{ t('sidebar.settings') }}</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { reactive } from 'vue'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  activeSection: { type: String, default: 'tasks' },
  activeView: { type: String, default: 'kanban' },
  isCollapsed: { type: Boolean, default: false },
  t: { type: Function, required: true }
})

defineEmits(['navigate', 'toggle-collapse'])

const expandedSections = reactive({
  tasks: true
})

function toggleSection(section) {
  if (props.isCollapsed) {
    // When collapsed, clicking navigates directly
    return
  }
  expandedSections[section] = !expandedSections[section]
}

const taskViews = [
  { id: 'kanban', icon: ViewColumnsIcon },
  { id: 'list', icon: ListBulletIcon },
  { id: 'calendar', icon: CalendarIcon },
  { id: 'timeline', icon: ClockIcon }
]
</script>
