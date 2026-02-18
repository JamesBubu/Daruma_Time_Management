<template>
  <div class="flex h-full">
    <!-- Notes List Panel -->
    <div class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">{{ t('notes.title') }}</h2>
        <button
          @click="createNote"
          class="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
        >
          + {{ t('notes.new') }}
        </button>
      </div>

      <div v-if="notesStore.isLoading" class="flex-1 flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
      </div>

      <div v-else-if="notesStore.notes.length === 0" class="flex-1 flex items-center justify-center p-4 text-center">
        <p class="text-sm text-gray-400">{{ t('notes.empty') }}</p>
      </div>

      <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        <li
          v-for="note in notesStore.notes"
          :key="note.id"
          @click="notesStore.selectNote(note.id)"
          :class="[
            'px-4 py-3 cursor-pointer transition-colors',
            notesStore.selectedNoteId === note.id
              ? 'bg-red-50 dark:bg-red-900/20 border-r-2 border-red-500'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ note.title || '無標題' }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ formatDate(note.updatedAt) }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Note Editor Panel -->
    <div class="flex-1 overflow-hidden bg-white dark:bg-gray-800">
      <NoteEditor
        v-if="notesStore.selectedNote"
        :note="notesStore.selectedNote"
        :tasks="tasks"
        :autosave-delay="settingsStore.clientSettings.autosaveDelay"
        @update="onUpdate"
        @delete="onDelete"
        @link-task="onLinkTask"
        @unlink-task="onUnlinkTask"
      />
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        <div class="text-center">
          <BookOpenIcon class="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>{{ t('notes.selectOrCreate') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { BookOpenIcon } from '@heroicons/vue/24/outline'
import { useNotesStore } from '../../stores/notesStore.js'
import { useSettingsStore } from '../../stores/settingsStore.js'
import NoteEditor from './NoteEditor.vue'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  t: { type: Function, required: true }
})

const notesStore = useNotesStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  await notesStore.fetchNotes()
})

async function createNote() {
  await notesStore.createNote({ title: '新筆記', content: '' })
}

async function onUpdate(id, data) {
  await notesStore.updateNote(id, data)
}

async function onDelete(id) {
  await notesStore.deleteNote(id)
}

async function onLinkTask(noteId, taskId) {
  await notesStore.linkTask(noteId, taskId)
}

async function onUnlinkTask(noteId, taskId) {
  await notesStore.unlinkTask(noteId, taskId)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
