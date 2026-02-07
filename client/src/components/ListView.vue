<template>
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <!-- Table Header -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable && toggleSort(col.key)"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
              ]"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
                <template v-if="col.sortable">
                  <ChevronUpIcon
                    v-if="sortBy === col.key && sortOrder === 'asc'"
                    class="w-4 h-4"
                  />
                  <ChevronDownIcon
                    v-else-if="sortBy === col.key && sortOrder === 'desc'"
                    class="w-4 h-4"
                  />
                  <ChevronUpDownIcon v-else class="w-4 h-4 text-gray-300" />
                </template>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="task in sortedTasks"
            :key="task.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-2 h-2 rounded-full mr-3',
                    statusColors[task.status]
                  ]"
                ></div>
                <span class="font-medium text-gray-900">{{ task.title }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  priorityClasses[task.priority]
                ]"
              >
                {{ priorityLabels[task.priority] }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  statusClasses[task.status]
                ]"
              >
                {{ statusLabels[task.status] }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(task.startDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(task.endDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                >
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button
                @click="$emit('edit', task)"
                class="text-blue-600 hover:text-blue-800 mr-3"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                @click="$emit('delete', task.id)"
                class="text-red-600 hover:text-red-800"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </td>
          </tr>
          <tr v-if="sortedTasks.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              沒有符合條件的任務
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '../stores/taskStore'

defineEmits(['edit', 'delete'])

const taskStore = useTaskStore()

const sortBy = ref('startDate')
const sortOrder = ref('asc')

const columns = [
  { key: 'title', label: '標題', sortable: true },
  { key: 'priority', label: '優先順序', sortable: true },
  { key: 'status', label: '狀態', sortable: true },
  { key: 'startDate', label: '開始日期', sortable: true },
  { key: 'endDate', label: '結束日期', sortable: true },
  { key: 'tags', label: '標籤', sortable: false }
]

const priorityLabels = { high: '高', medium: '中', low: '低' }
const statusLabels = { 'todo': '待辦', 'in-progress': '進行中', 'done': '完成' }

const priorityClasses = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
}

const statusClasses = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700'
}

const statusColors = {
  'todo': 'bg-gray-400',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500'
}

const priorityOrder = { high: 0, medium: 1, low: 2 }
const statusOrder = { 'todo': 0, 'in-progress': 1, 'done': 2 }

const sortedTasks = computed(() => {
  const tasks = [...taskStore.filteredTasks]
  return tasks.sort((a, b) => {
    let aVal, bVal
    if (sortBy.value === 'priority') {
      aVal = priorityOrder[a.priority]
      bVal = priorityOrder[b.priority]
    } else if (sortBy.value === 'status') {
      aVal = statusOrder[a.status]
      bVal = statusOrder[b.status]
    } else if (sortBy.value === 'startDate' || sortBy.value === 'endDate') {
      aVal = new Date(a[sortBy.value] || 0).getTime()
      bVal = new Date(b[sortBy.value] || 0).getTime()
    } else {
      aVal = a[sortBy.value]?.toLowerCase() || ''
      bVal = b[sortBy.value]?.toLowerCase() || ''
    }
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

function toggleSort(key) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
