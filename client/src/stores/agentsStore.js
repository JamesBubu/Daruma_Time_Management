import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref([])
  const isLoading = ref(false)
  const isRunning = ref({})
  const runResults = ref({})

  async function fetchAgents() {
    isLoading.value = true
    try {
      const res = await fetch('/api/agents')
      agents.value = await res.json()
    } catch (err) {
      console.error('Failed to fetch agents:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createAgent(data) {
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const newAgent = await res.json()
      agents.value.push(newAgent)
      return newAgent
    } catch (err) {
      console.error('Failed to create agent:', err)
    }
  }

  async function updateAgent(id, data) {
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const updated = await res.json()
      const index = agents.value.findIndex(a => a.id === id)
      if (index !== -1) agents.value[index] = updated
      return updated
    } catch (err) {
      console.error('Failed to update agent:', err)
    }
  }

  async function deleteAgent(id) {
    try {
      await fetch(`/api/agents/${id}`, { method: 'DELETE' })
      agents.value = agents.value.filter(a => a.id !== id)
      delete isRunning.value[id]
      delete runResults.value[id]
    } catch (err) {
      console.error('Failed to delete agent:', err)
    }
  }

  async function toggleAgent(id) {
    const agent = agents.value.find(a => a.id === id)
    if (!agent) return
    await updateAgent(id, { enabled: !agent.enabled })
  }

  async function runAgent(id, message) {
    isRunning.value[id] = true
    runResults.value[id] = null
    try {
      const res = await fetch(`/api/agents/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      if (!res.ok) {
        runResults.value[id] = { error: data.error || 'Run failed' }
      } else {
        runResults.value[id] = { output: data.output }
      }
    } catch (err) {
      runResults.value[id] = { error: err.message }
    } finally {
      isRunning.value[id] = false
    }
  }

  return {
    agents,
    isLoading,
    isRunning,
    runResults,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgent,
    runAgent
  }
})
