import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // Server-side settings (paths, agent timeout)
  const serverSettings = ref({ paths: { tasks: '', notes: '', agents: '' }, agent: { timeout: 60 } })
  const resolvedPaths = ref({ tasks: '', notes: '', agents: '' })
  const isLoading = ref(false)
  const isSaving = ref(false)

  // Client-side settings (stored in localStorage)
  const clientSettings = reactive({
    autosaveDelay: parseInt(localStorage.getItem('autosaveDelay') || '800'),
    defaultEditorMode: localStorage.getItem('defaultEditorMode') || 'edit',
    defaultTaskView: localStorage.getItem('defaultTaskView') || 'kanban',
  })

  // Path test results: { tasks: {ok, message}, notes: {...}, agents: {...} }
  const pathTestResults = reactive({ tasks: null, notes: null, agents: null })
  const isTestingPath = reactive({ tasks: false, notes: false, agents: false })

  async function fetchSettings() {
    isLoading.value = true
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      serverSettings.value = data.settings
      resolvedPaths.value = data.resolvedPaths
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function saveServerSettings(patch) {
    isSaving.value = true
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      const data = await res.json()
      serverSettings.value = data.settings
      resolvedPaths.value = data.resolvedPaths
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    } finally {
      isSaving.value = false
    }
  }

  async function testPath(type, path) {
    isTestingPath[type] = true
    pathTestResults[type] = null
    try {
      const res = await fetch('/api/settings/test-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })
      const data = await res.json()
      pathTestResults[type] = res.ok ? { ok: true, message: data.message } : { ok: false, message: data.error }
    } catch (err) {
      pathTestResults[type] = { ok: false, message: err.message }
    } finally {
      isTestingPath[type] = false
    }
  }

  async function resetPaths() {
    try {
      const res = await fetch('/api/settings/reset-paths', { method: 'POST' })
      const data = await res.json()
      serverSettings.value = data.settings
      resolvedPaths.value = data.resolvedPaths
      pathTestResults.tasks = null
      pathTestResults.notes = null
      pathTestResults.agents = null
    } catch (err) {
      console.error('Failed to reset paths:', err)
    }
  }

  function setAutosaveDelay(ms) {
    clientSettings.autosaveDelay = ms
    localStorage.setItem('autosaveDelay', String(ms))
  }

  function setDefaultEditorMode(mode) {
    clientSettings.defaultEditorMode = mode
    localStorage.setItem('defaultEditorMode', mode)
  }

  function setDefaultTaskView(view) {
    clientSettings.defaultTaskView = view
    localStorage.setItem('defaultTaskView', view)
  }

  return {
    serverSettings, resolvedPaths, isLoading, isSaving,
    clientSettings, pathTestResults, isTestingPath,
    fetchSettings, saveServerSettings, testPath, resetPaths,
    setAutosaveDelay, setDefaultEditorMode, setDefaultTaskView
  }
})
