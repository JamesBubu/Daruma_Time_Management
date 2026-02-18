<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4">

    <!-- Edit mode -->
    <template v-if="isEditing">
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">名稱</label>
          <input
            v-model="editForm.name"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">描述</label>
          <input
            v-model="editForm.description"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">System Prompt</label>
          <textarea
            v-model="editForm.systemPrompt"
            rows="5"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
          ></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-1">
          <button
            @click="cancelEdit"
            class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >取消</button>
          <button
            @click="saveEdit"
            class="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >儲存</button>
        </div>
      </div>
    </template>

    <!-- View mode -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ agent.name }}</h3>
          <p v-if="agent.description" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ agent.description }}</p>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <!-- Edit -->
          <button
            @click="startEdit"
            class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="編輯設定"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <!-- Toggle -->
          <button
            @click="$emit('toggle', agent.id)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              agent.enabled ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
            :title="agent.enabled ? '停用' : '啟用'"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                agent.enabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            ></span>
          </button>
          <!-- Delete -->
          <button
            @click="$emit('delete', agent.id)"
            class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="刪除代理人"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- System Prompt preview -->
      <div v-if="agent.systemPrompt" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 line-clamp-2 font-mono">
        {{ agent.systemPrompt }}
      </div>

      <!-- Disabled notice -->
      <div v-if="!agent.enabled" class="text-sm text-gray-400 dark:text-gray-500 italic">
        此代理人已停用
      </div>

      <!-- Run area (only when enabled) -->
      <div v-else class="flex flex-col gap-2">
        <div class="flex gap-2">
          <input
            v-model="message"
            @keydown.enter="run"
            type="text"
            placeholder="輸入訊息，按 Enter 或點擊執行..."
            class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            :disabled="isRunning"
          />
          <button
            @click="run"
            :disabled="isRunning || !message.trim()"
            class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span v-if="isRunning" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <PlayIcon v-else class="w-4 h-4" />
            <span>{{ isRunning ? '執行中...' : '執行' }}</span>
          </button>
        </div>
      </div>

      <!-- Result -->
      <div v-if="runResult">
        <div v-if="runResult.error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <span class="font-medium">錯誤：</span>{{ runResult.error }}
          <p v-if="runResult.details" class="mt-1 text-xs font-mono opacity-70">{{ runResult.details }}</p>
        </div>
        <div v-else class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 whitespace-pre-wrap max-h-64 overflow-y-auto font-mono">
          {{ runResult.output }}
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { TrashIcon, PencilIcon, PlayIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  agent: { type: Object, required: true },
  isRunning: { type: Boolean, default: false },
  runResult: { type: Object, default: null }
})

const emit = defineEmits(['toggle', 'delete', 'run', 'update'])

const message = ref('')
const isEditing = ref(false)
const editForm = reactive({ name: '', description: '', systemPrompt: '' })

function run() {
  if (!message.value.trim() || props.isRunning) return
  emit('run', props.agent.id, message.value)
  message.value = ''
}

function startEdit() {
  editForm.name = props.agent.name
  editForm.description = props.agent.description
  editForm.systemPrompt = props.agent.systemPrompt
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  emit('update', props.agent.id, {
    name: editForm.name,
    description: editForm.description,
    systemPrompt: editForm.systemPrompt
  })
  isEditing.value = false
}
</script>
