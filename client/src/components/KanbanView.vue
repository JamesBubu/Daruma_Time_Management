<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Todo Column -->
    <div class="bg-gray-50 rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gray-400"></span>
          待辦
          <span class="text-sm text-gray-400">({{ todoTasks.length }})</span>
        </h3>
      </div>
      <VueDraggable
        v-model="todoTasks"
        group="tasks"
        item-key="id"
        class="space-y-3 min-h-[200px]"
        @end="(e) => handleDragEnd(e, 'todo')"
      >
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @edit="$emit('edit', element)"
            @delete="$emit('delete', element.id)"
          />
        </template>
      </VueDraggable>
    </div>

    <!-- In Progress Column -->
    <div class="bg-blue-50 rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-blue-500"></span>
          進行中
          <span class="text-sm text-gray-400">({{ inProgressTasks.length }})</span>
        </h3>
      </div>
      <VueDraggable
        v-model="inProgressTasks"
        group="tasks"
        item-key="id"
        class="space-y-3 min-h-[200px]"
        @end="(e) => handleDragEnd(e, 'in-progress')"
      >
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @edit="$emit('edit', element)"
            @delete="$emit('delete', element.id)"
          />
        </template>
      </VueDraggable>
    </div>

    <!-- Done Column -->
    <div class="bg-green-50 rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-700 flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-green-500"></span>
          完成
          <span class="text-sm text-gray-400">({{ doneTasks.length }})</span>
        </h3>
      </div>
      <VueDraggable
        v-model="doneTasks"
        group="tasks"
        item-key="id"
        class="space-y-3 min-h-[200px]"
        @end="(e) => handleDragEnd(e, 'done')"
      >
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @edit="$emit('edit', element)"
            @delete="$emit('delete', element.id)"
          />
        </template>
      </VueDraggable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from './TaskCard.vue'

const emit = defineEmits(['edit', 'delete'])

const taskStore = useTaskStore()

const todoTasks = ref([])
const inProgressTasks = ref([])
const doneTasks = ref([])

watch(
  () => taskStore.filteredTasks,
  (tasks) => {
    todoTasks.value = tasks.filter(t => t.status === 'todo')
    inProgressTasks.value = tasks.filter(t => t.status === 'in-progress')
    doneTasks.value = tasks.filter(t => t.status === 'done')
  },
  { immediate: true }
)

async function handleDragEnd(event, newStatus) {
  const taskElement = event.item?.__draggable_context?.element
  if (!taskElement) return

  const taskId = taskElement.id
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task && task.status !== newStatus) {
    await taskStore.updateTaskStatus(taskId, newStatus)
  }
}
</script>
