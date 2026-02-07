<template>
  <div>
    <!-- Timeline Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          @click="navigateMonth(-1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          &lt;
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ currentMonth.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'zh-TW', { year: 'numeric', month: 'long' }) }}
        </h3>
        <button
          @click="navigateMonth(1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          &gt;
        </button>
      </div>
      <button
        @click="currentMonth = new Date()"
        class="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        {{ t('timeline.today') }}
      </button>
    </div>

    <!-- Timeline Grid -->
    <div class="overflow-x-auto">
      <div class="min-w-[800px]">
        <!-- Days Header -->
        <div class="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          <div class="w-48 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('timeline.tasks') }}</div>
          <div class="flex-1 flex">
            <div
              v-for="day in daysInMonth"
              :key="day"
              :class="[
                'flex-1 text-center text-xs',
                isToday(day) ? 'text-red-500 font-bold' : 'text-gray-400 dark:text-gray-500'
              ]"
            >
              {{ day }}
            </div>
          </div>
        </div>

        <!-- Task Rows -->
        <div class="space-y-2">
          <div
            v-for="task in sortedTasks"
            :key="task.id"
            class="flex items-center group"
          >
            <!-- Task Info -->
            <div
              class="w-48 flex-shrink-0 pr-4 cursor-pointer"
              @click="$emit('edit', task)"
            >
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'w-2 h-2 rounded-full flex-shrink-0',
                    statusColors[task.status]
                  ]"
                ></span>
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {{ task.title }}
                </span>
              </div>
            </div>

            <!-- Timeline Bar -->
            <div class="flex-1 relative h-8">
              <div class="absolute inset-0 flex">
                <div
                  v-for="day in daysInMonth"
                  :key="day"
                  :class="[
                    'flex-1 border-l border-gray-100 dark:border-gray-700',
                    isToday(day) ? 'bg-red-50 dark:bg-red-900/20' : ''
                  ]"
                ></div>
              </div>
              <div
                v-if="getTaskBar(task)"
                :style="getTaskBar(task).style"
                :class="[
                  'absolute top-1 h-6 rounded cursor-pointer transition-all',
                  'hover:opacity-90 hover:shadow',
                  priorityColors[task.priority]
                ]"
                @click="$emit('edit', task)"
              >
                <span class="px-2 text-xs text-white truncate leading-6 block">
                  {{ task.title }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="sortedTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            {{ t('timeline.noTasks') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('timeline.legend') }}</span>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-red-500"></span>
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('priority.high') }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-yellow-500"></span>
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('priority.medium') }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-green-500"></span>
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('priority.low') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  t: { type: Function, required: true },
  locale: { type: String, default: 'zh-TW' }
})

defineEmits(['edit'])

const currentMonth = ref(new Date())

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
}

const statusColors = {
  'todo': 'bg-gray-400',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500'
}

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate)
  })
})

function navigateMonth(delta) {
  const newDate = new Date(currentMonth.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentMonth.value = newDate
}

function isToday(day) {
  const today = new Date()
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonth.value.getMonth() &&
    today.getFullYear() === currentMonth.value.getFullYear()
  )
}

function getTaskBar(task) {
  if (!task.startDate || !task.endDate) return null

  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)
  const totalDays = daysInMonth.value.length

  const taskStart = new Date(task.startDate)
  const taskEnd = new Date(task.endDate)

  if (taskEnd < monthStart || taskStart > monthEnd) return null

  const startDay = taskStart < monthStart ? 1 : taskStart.getDate()
  const endDay = taskEnd > monthEnd ? totalDays : taskEnd.getDate()

  const left = ((startDay - 1) / totalDays) * 100
  const width = ((endDay - startDay + 1) / totalDays) * 100

  return {
    style: {
      left: `${left}%`,
      width: `${Math.max(width, 3)}%`
    }
  }
}
</script>
