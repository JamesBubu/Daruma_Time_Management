<template>
  <div
    :class="[
      'bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow',
      `priority-${task.priority}`
    ]"
    @click="$emit('edit', task)"
  >
    <div class="flex items-start justify-between">
      <h3 class="font-medium text-gray-900 text-sm">{{ task.title }}</h3>
      <button
        @click.stop="$emit('delete', task.id)"
        class="text-gray-400 hover:text-red-500 transition-colors"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>

    <p v-if="task.description" class="text-gray-500 text-xs mt-2 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
      <div class="flex items-center gap-1 text-xs text-gray-400">
        <CalendarIcon class="w-3 h-3" />
        <span>{{ formatDate(task.startDate) }}</span>
      </div>
      <span
        :class="[
          'px-2 py-0.5 text-xs rounded-full font-medium',
          priorityClasses[task.priority]
        ]"
      >
        {{ priorityLabels[task.priority] }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline'

defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低'
}

const priorityClasses = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
}
</script>
