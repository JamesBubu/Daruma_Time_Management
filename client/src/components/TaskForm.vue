<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ task ? t('task.editTask') : t('task.addTask') }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Task ID (read-only, only shown when editing) -->
          <div v-if="task">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</label>
            <div class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-mono text-sm">
              {{ task.id }}
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.titleRequired') }}</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :placeholder="t('task.titlePlaceholder')"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.description') }}</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              :placeholder="t('task.descriptionPlaceholder')"
            ></textarea>
          </div>

          <!-- Priority & Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.priorityLabel') }}</label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="high">{{ t('priority.high') }}</option>
                <option value="medium">{{ t('priority.medium') }}</option>
                <option value="low">{{ t('priority.low') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.statusLabel') }}</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="todo">{{ t('status.todo') }}</option>
                <option value="in-progress">{{ t('status.in-progress') }}</option>
                <option value="done">{{ t('status.done') }}</option>
              </select>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.startDate') }}</label>
              <input
                v-model="form.startDate"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.endDate') }}</label>
              <input
                v-model="form.endDate"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('task.tagsLabel') }}</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  form.tags.includes(tag)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]"
              >
                {{ tag }}
              </button>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newTag"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                :placeholder="t('task.addTag')"
                @keydown.enter.prevent="addNewTag"
              />
              <button
                type="button"
                @click="addNewTag"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <!-- Linked Notes (backlinks) -->
          <div v-if="linkedNoteObjects.length > 0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 相關筆記
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="note in linkedNoteObjects"
                :key="note.id"
                type="button"
                @click="navigateToNote(note.id)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800"
              >
                <span>{{ note.title }}</span>
                <ArrowTopRightOnSquareIcon class="w-3 h-3 opacity-60" />
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1.5">點擊筆記可跳轉到第二大腦，或在第二大腦中管理關聯</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              {{ t('task.cancel') }}
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {{ task ? t('task.update') : t('task.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  task: { type: Object, default: null },
  tags: { type: Array, default: () => [] },
  notes: { type: Array, default: () => [] },
  t: { type: Function, required: true }
})

const emit = defineEmits(['close', 'save', 'add-tag', 'navigate-to-note'])

function navigateToNote(noteId) {
  emit('navigate-to-note', noteId)
}

const newTag = ref('')

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  startDate: '',
  endDate: '',
  tags: [],
  linkedNotes: []
})

const linkedNoteObjects = computed(() => {
  return form.linkedNotes
    .map(nid => props.notes.find(n => n.id === nid))
    .filter(Boolean)
})

watch(() => props.task, (task) => {
  if (task) {
    form.title = task.title
    form.description = task.description || ''
    form.priority = task.priority
    form.status = task.status
    form.startDate = formatDateForInput(task.startDate)
    form.endDate = formatDateForInput(task.endDate)
    form.tags = [...(task.tags || [])]
    form.linkedNotes = [...(task.linkedNotes || [])]
  } else {
    resetForm()
  }
}, { immediate: true })

function formatDateForInput(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toISOString().slice(0, 16)
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.status = 'todo'
  form.startDate = ''
  form.endDate = ''
  form.tags = []
  form.linkedNotes = []
}

function toggleTag(tag) {
  const index = form.tags.indexOf(tag)
  if (index === -1) {
    form.tags.push(tag)
  } else {
    form.tags.splice(index, 1)
  }
}

function addNewTag() {
  if (!newTag.value.trim()) return
  const tag = newTag.value.trim()
  if (!props.tags.includes(tag)) {
    emit('add-tag', tag)
  }
  if (!form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  newTag.value = ''
}

function handleSubmit() {
  emit('save', {
    title: form.title,
    description: form.description,
    priority: form.priority,
    status: form.status,
    startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
    endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    tags: form.tags
  })
}
</script>
