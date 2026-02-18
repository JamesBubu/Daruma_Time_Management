<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('agents.title') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('agents.description') }}</p>
      </div>
      <button
        @click="showModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <span class="text-lg">+</span>
        {{ t('agents.new') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="agentsStore.isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="agentsStore.agents.length === 0" class="text-center py-12 text-gray-400">
      <CpuChipIcon class="w-16 h-16 mx-auto mb-4 opacity-30" />
      <p>{{ t('agents.empty') }}</p>
    </div>

    <!-- Agent grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AgentCard
        v-for="agent in agentsStore.agents"
        :key="agent.id"
        :agent="agent"
        :is-running="!!agentsStore.isRunning[agent.id]"
        :run-result="agentsStore.runResults[agent.id] || null"
        @toggle="agentsStore.toggleAgent"
        @delete="agentsStore.deleteAgent"
        @run="agentsStore.runAgent"
        @update="agentsStore.updateAgent"
      />
    </div>

    <!-- Create Agent Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('agents.createTitle') }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="handleCreate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('agents.nameLabel') }} *</label>
              <input
                v-model="form.name"
                required
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                :placeholder="t('agents.namePlaceholder')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('agents.descLabel') }}</label>
              <input
                v-model="form.description"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                :placeholder="t('agents.descPlaceholder')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('agents.systemPromptLabel') }}</label>
              <textarea
                v-model="form.systemPrompt"
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                :placeholder="t('agents.systemPromptPlaceholder')"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                {{ t('task.cancel') }}
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {{ t('task.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { CpuChipIcon } from '@heroicons/vue/24/outline'
import { useAgentsStore } from '../../stores/agentsStore.js'
import AgentCard from './AgentCard.vue'

const props = defineProps({
  t: { type: Function, required: true }
})

const agentsStore = useAgentsStore()

const showModal = ref(false)
const form = reactive({
  name: '',
  description: '',
  systemPrompt: ''
})

onMounted(async () => {
  await agentsStore.fetchAgents()
})

function closeModal() {
  showModal.value = false
  form.name = ''
  form.description = ''
  form.systemPrompt = ''
}

async function handleCreate() {
  await agentsStore.createAgent({
    name: form.name,
    description: form.description,
    systemPrompt: form.systemPrompt
  })
  closeModal()
}
</script>
