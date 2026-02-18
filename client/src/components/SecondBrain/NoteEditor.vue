<template>
  <div class="flex flex-col h-full">
    <!-- Header bar -->
    <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
      <input
        v-model="localTitle"
        @blur="saveTitle"
        class="flex-1 text-xl font-semibold bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400"
        placeholder="筆記標題..."
      />
      <button
        @click="showPreview = !showPreview"
        :class="[
          'px-3 py-1.5 text-sm rounded-lg transition-colors',
          showPreview
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        {{ showPreview ? '編輯' : '預覽' }}
      </button>
      <button
        @click="$emit('delete', note.id)"
        class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        title="刪除筆記"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Editor / Preview -->
    <div class="flex-1 overflow-hidden">
      <textarea
        v-if="!showPreview"
        v-model="localContent"
        @input="onContentInput"
        class="w-full h-full p-4 bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
        placeholder="使用 Markdown 格式撰寫筆記..."
      ></textarea>
      <div
        v-else
        class="markdown-preview p-4 overflow-y-auto h-full text-gray-900 dark:text-white"
        v-html="renderedContent"
      ></div>
    </div>

    <!-- Linked Tasks -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">相關任務</h4>
        <span v-if="isSaving" class="text-xs text-gray-400">儲存中...</span>
        <span v-else-if="savedAt" class="text-xs text-gray-400">已儲存</span>
      </div>

      <!-- Linked task chips -->
      <div v-if="linkedTaskObjects.length > 0" class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="task in linkedTaskObjects"
          :key="task.id"
          class="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
        >
          {{ task.title }}
          <button
            @click="$emit('unlink-task', note.id, task.id)"
            class="ml-1 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </span>
      </div>

      <!-- Add link -->
      <select
        @change="onLinkTask($event)"
        class="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      >
        <option value="">＋ 新增相關任務...</option>
        <option
          v-for="task in availableTasks"
          :key="task.id"
          :value="task.id"
        >
          {{ task.title }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  note: { type: Object, required: true },
  tasks: { type: Array, default: () => [] },
  autosaveDelay: { type: Number, default: 800 }
})

const emit = defineEmits(['update', 'delete', 'link-task', 'unlink-task'])

const localTitle = ref(props.note.title)
const localContent = ref(props.note.content)
const showPreview = ref(false)
const isSaving = ref(false)
const savedAt = ref(false)

let debounceTimer = null

watch(() => props.note, (newNote) => {
  localTitle.value = newNote.title
  localContent.value = newNote.content
}, { deep: true })

const renderedContent = computed(() => {
  return marked(localContent.value || '')
})

const linkedTaskObjects = computed(() => {
  return (props.note.linkedTasks || [])
    .map(tid => props.tasks.find(t => t.id === tid))
    .filter(Boolean)
})

const availableTasks = computed(() => {
  return props.tasks.filter(t => !(props.note.linkedTasks || []).includes(t.id))
})

function saveTitle() {
  if (localTitle.value !== props.note.title) {
    emit('update', props.note.id, { title: localTitle.value })
  }
}

function onContentInput() {
  clearTimeout(debounceTimer)
  isSaving.value = false
  savedAt.value = false
  debounceTimer = setTimeout(() => {
    isSaving.value = true
    emit('update', props.note.id, { content: localContent.value })
    setTimeout(() => {
      isSaving.value = false
      savedAt.value = true
    }, 500)
  }, props.autosaveDelay)
}

function onLinkTask(event) {
  const taskId = event.target.value
  if (!taskId) return
  emit('link-task', props.note.id, taskId)
  event.target.value = ''
}
</script>

<style>
.markdown-preview h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; }
.markdown-preview h2 { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.25rem; }
.markdown-preview h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
.markdown-preview p { margin-bottom: 0.75rem; line-height: 1.7; }
.markdown-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.markdown-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.markdown-preview li { margin-bottom: 0.25rem; }
.markdown-preview code { font-family: monospace; background: rgba(0,0,0,0.06); padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.9em; }
.dark .markdown-preview code { background: rgba(255,255,255,0.1); }
.markdown-preview pre { background: rgba(0,0,0,0.06); padding: 1rem; border-radius: 6px; overflow-x: auto; margin-bottom: 0.75rem; }
.dark .markdown-preview pre { background: rgba(255,255,255,0.08); }
.markdown-preview pre code { background: none; padding: 0; }
.markdown-preview blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #6b7280; margin-bottom: 0.75rem; }
.dark .markdown-preview blockquote { border-color: #4b5563; color: #9ca3af; }
.markdown-preview a { color: #ef4444; text-decoration: underline; }
.markdown-preview hr { border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
.dark .markdown-preview hr { border-color: #374151; }
</style>
