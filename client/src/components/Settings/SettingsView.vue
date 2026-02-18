<template>
  <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">

    <div class="flex items-center justify-between mb-2">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('settings.title') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('settings.subtitle') }}</p>
      </div>
    </div>

    <!-- ─── 1. Appearance ─── -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <SwatchIcon class="w-5 h-5 text-gray-400" /> {{ t('settings.appearance.title') }}
      </h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.language') }}</p>
          </div>
          <select
            :value="locale"
            @change="setLocale($event.target.value)"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option v-for="(name, code) in localeNames" :key="code" :value="code">{{ name }}</option>
          </select>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.darkMode') }}</p>
          </div>
          <button
            @click="toggleDarkMode"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              darkMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', darkMode ? 'translate-x-6' : 'translate-x-1']"></span>
          </button>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.appearance.defaultTaskView') }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('settings.appearance.defaultTaskViewDesc') }}</p>
          </div>
          <select
            :value="settingsStore.clientSettings.defaultTaskView"
            @change="settingsStore.setDefaultTaskView($event.target.value)"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="kanban">{{ t('nav.kanban') }}</option>
            <option value="list">{{ t('nav.list') }}</option>
            <option value="calendar">{{ t('nav.calendar') }}</option>
            <option value="timeline">{{ t('nav.timeline') }}</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ─── 2. Data Storage ─── -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderIcon class="w-5 h-5 text-gray-400" /> {{ t('settings.data.title') }}
        </h3>
        <button
          @click="resetPaths"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors underline"
        >{{ t('settings.data.resetDefaults') }}</button>
      </div>
      <p class="text-xs text-gray-400 mb-5">{{ t('settings.data.hint') }}</p>

      <div class="space-y-5">
        <PathInput
          v-for="type in ['tasks', 'notes', 'agents']"
          :key="type"
          :label="t(`settings.data.${type}File`)"
          :placeholder="settingsStore.resolvedPaths[type]"
          :model-value="pathDrafts[type]"
          :test-result="settingsStore.pathTestResults[type]"
          :is-testing="settingsStore.isTestingPath[type]"
          :is-saving="settingsStore.isSaving"
          :t="t"
          @update:model-value="pathDrafts[type] = $event"
          @test="testPath(type)"
          @save="savePath(type)"
        />
      </div>
    </section>

    <!-- ─── 3. Editor ─── -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <PencilSquareIcon class="w-5 h-5 text-gray-400" /> {{ t('settings.editor.title') }}
      </h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.editor.autosaveDelay') }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('settings.editor.autosaveDelayDesc') }}</p>
          </div>
          <select
            :value="settingsStore.clientSettings.autosaveDelay"
            @change="settingsStore.setAutosaveDelay(parseInt($event.target.value))"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="300">0.3s</option>
            <option value="800">0.8s (default)</option>
            <option value="2000">2s</option>
            <option value="5000">5s</option>
          </select>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.editor.defaultMode') }}</p>
          </div>
          <div class="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              v-for="mode in ['edit', 'preview']"
              :key="mode"
              @click="settingsStore.setDefaultEditorMode(mode)"
              :class="[
                'px-3 py-1.5 text-sm transition-colors',
                settingsStore.clientSettings.defaultEditorMode === mode
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ t(`settings.editor.mode.${mode}`) }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 4. Agent Runner ─── -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <CpuChipIcon class="w-5 h-5 text-gray-400" /> {{ t('settings.agent.title') }}
      </h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('settings.agent.timeout') }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('settings.agent.timeoutDesc') }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select
              v-model="timeoutDraft"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option :value="30">30s</option>
              <option :value="60">60s (default)</option>
              <option :value="120">120s</option>
              <option :value="300">300s</option>
            </select>
            <button
              @click="saveTimeout"
              :disabled="settingsStore.isSaving"
              class="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >{{ t('settings.save') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 5. Documentation ─── -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpenIcon class="w-5 h-5 text-gray-400" /> {{ t('settings.docs.title') }}
      </h3>

      <!-- Doc tab switcher -->
      <div class="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in docTabs"
          :key="tab.id"
          @click="activeDocTab = tab.id"
          :class="[
            'flex-1 px-3 py-1.5 text-sm rounded-md transition-colors',
            activeDocTab === tab.id
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          ]"
        >{{ tab.label }}</button>
      </div>

      <!-- Quick Start -->
      <div v-if="activeDocTab === 'quickstart'" class="prose-sm space-y-4 text-gray-700 dark:text-gray-300">
        <div v-for="item in quickStartSteps" :key="item.title" class="flex gap-3">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center">{{ item.n }}</span>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Markdown Reference -->
      <div v-if="activeDocTab === 'markdown'" class="space-y-3">
        <div v-for="row in markdownRef" :key="row.syntax" class="flex items-start gap-4 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <code class="flex-shrink-0 w-44 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-mono">{{ row.syntax }}</code>
          <div class="flex-1 text-sm" v-html="row.preview"></div>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div v-if="activeDocTab === 'shortcuts'" class="space-y-3">
        <div v-for="s in shortcuts" :key="s.key" class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ s.desc }}</span>
          <kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-mono">{{ s.key }}</kbd>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { SwatchIcon, FolderIcon, PencilSquareIcon, CpuChipIcon, BookOpenIcon } from '@heroicons/vue/24/outline'
import { useSettingsStore } from '../../stores/settingsStore.js'
import { useSettings } from '../../composables/useSettings.js'
import PathInput from './PathInput.vue'

const props = defineProps({ t: { type: Function, required: true } })
const { locale, darkMode, localeNames, t, setLocale, toggleDarkMode } = useSettings()
const settingsStore = useSettingsStore()

// Path draft inputs (show current setting, user edits)
const pathDrafts = reactive({ tasks: '', notes: '', agents: '' })
const timeoutDraft = ref(60)

onMounted(async () => {
  await settingsStore.fetchSettings()
  pathDrafts.tasks  = settingsStore.serverSettings.paths.tasks
  pathDrafts.notes  = settingsStore.serverSettings.paths.notes
  pathDrafts.agents = settingsStore.serverSettings.paths.agents
  timeoutDraft.value = settingsStore.serverSettings.agent.timeout
})

watch(() => settingsStore.serverSettings, (s) => {
  if (!pathDrafts.tasks) pathDrafts.tasks = s.paths.tasks
  if (!pathDrafts.notes) pathDrafts.notes = s.paths.notes
  if (!pathDrafts.agents) pathDrafts.agents = s.paths.agents
  timeoutDraft.value = s.agent.timeout
}, { deep: true })

async function testPath(type) {
  await settingsStore.testPath(type, pathDrafts[type])
}

async function savePath(type) {
  await settingsStore.saveServerSettings({ paths: { [type]: pathDrafts[type] } })
  settingsStore.pathTestResults[type] = null
}

async function saveTimeout() {
  await settingsStore.saveServerSettings({ agent: { timeout: timeoutDraft.value } })
}

function resetPaths() {
  settingsStore.resetPaths()
  pathDrafts.tasks = ''
  pathDrafts.notes = ''
  pathDrafts.agents = ''
}

// Documentation content
const activeDocTab = ref('quickstart')
const docTabs = computed(() => [
  { id: 'quickstart', label: t('settings.docs.quickstart') },
  { id: 'markdown',   label: t('settings.docs.markdown') },
  { id: 'shortcuts',  label: t('settings.docs.shortcuts') },
])

const quickStartSteps = computed(() => [
  { n: 1, title: t('settings.docs.qs.step1.title'), desc: t('settings.docs.qs.step1.desc') },
  { n: 2, title: t('settings.docs.qs.step2.title'), desc: t('settings.docs.qs.step2.desc') },
  { n: 3, title: t('settings.docs.qs.step3.title'), desc: t('settings.docs.qs.step3.desc') },
  { n: 4, title: t('settings.docs.qs.step4.title'), desc: t('settings.docs.qs.step4.desc') },
  { n: 5, title: t('settings.docs.qs.step5.title'), desc: t('settings.docs.qs.step5.desc') },
])

const markdownRef = [
  { syntax: '# Heading 1',     preview: '<h1 class="text-xl font-bold">Heading 1</h1>' },
  { syntax: '## Heading 2',    preview: '<h2 class="text-lg font-semibold">Heading 2</h2>' },
  { syntax: '**bold**',        preview: '<strong>bold</strong>' },
  { syntax: '_italic_',        preview: '<em>italic</em>' },
  { syntax: '- item',          preview: '<ul class="list-disc ml-4"><li>item</li></ul>' },
  { syntax: '1. item',         preview: '<ol class="list-decimal ml-4"><li>item</li></ol>' },
  { syntax: '`code`',          preview: '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">code</code>' },
  { syntax: '```\\nblock\\n```', preview: '<pre class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">code block</pre>' },
  { syntax: '> quote',         preview: '<blockquote class="border-l-4 border-gray-300 pl-3 italic text-gray-500">quote</blockquote>' },
  { syntax: '[text](url)',      preview: '<a class="text-red-500 underline">link text</a>' },
  { syntax: '---',             preview: '<hr class="border-gray-300"/>' },
]

const shortcuts = computed(() => [
  { key: 'Enter',        desc: t('settings.docs.shortcuts.agentRun') },
  { key: 'Ctrl/⌘ + S',  desc: t('settings.docs.shortcuts.noteSave') },
  { key: 'Esc',          desc: t('settings.docs.shortcuts.closeModal') },
])
</script>
