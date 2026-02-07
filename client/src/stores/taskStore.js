import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE = '/api'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const tags = ref([])
  const currentView = ref('kanban')
  const isLoading = ref(false)
  const error = ref(null)
  const filterStatus = ref('all')
  const filterPriority = ref('all')
  const filterTags = ref([])
  const searchQuery = ref('')

  // Getters
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      // Status filter
      if (filterStatus.value !== 'all' && task.status !== filterStatus.value) {
        return false
      }
      // Priority filter
      if (filterPriority.value !== 'all' && task.priority !== filterPriority.value) {
        return false
      }
      // Tags filter
      if (filterTags.value.length > 0) {
        if (!filterTags.value.some(tag => task.tags.includes(tag))) {
          return false
        }
      }
      // Search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        )
      }
      return true
    })
  })

  const tasksByStatus = computed(() => ({
    todo: filteredTasks.value.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.value.filter(t => t.status === 'in-progress'),
    done: filteredTasks.value.filter(t => t.status === 'done')
  }))

  const taskStats = computed(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter(t => t.status === 'todo').length,
    inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
    done: tasks.value.filter(t => t.status === 'done').length
  }))

  // Actions
  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/tasks`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      tasks.value = await response.json()
    } catch (e) {
      error.value = e.message
      console.error('Error fetching tasks:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTags() {
    try {
      const response = await fetch(`${API_BASE}/tags`)
      if (!response.ok) throw new Error('Failed to fetch tags')
      tags.value = await response.json()
    } catch (e) {
      console.error('Error fetching tags:', e)
    }
  }

  async function createTask(taskData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      tasks.value.push(newTask)
      return newTask
    } catch (e) {
      error.value = e.message
      console.error('Error creating task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id, taskData) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (e) {
      error.value = e.message
      console.error('Error updating task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(id) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete task')
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e.message
      console.error('Error deleting task:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateTaskStatus(id, status) {
    return updateTask(id, { status })
  }

  async function addTag(tag) {
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      })
      if (!response.ok) throw new Error('Failed to add tag')
      tags.value = await response.json()
    } catch (e) {
      console.error('Error adding tag:', e)
      throw e
    }
  }

  function setView(view) {
    currentView.value = view
  }

  function setFilterStatus(status) {
    filterStatus.value = status
  }

  function setFilterPriority(priority) {
    filterPriority.value = priority
  }

  function setFilterTags(selectedTags) {
    filterTags.value = selectedTags
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearFilters() {
    filterStatus.value = 'all'
    filterPriority.value = 'all'
    filterTags.value = []
    searchQuery.value = ''
  }

  return {
    // State
    tasks,
    tags,
    currentView,
    isLoading,
    error,
    filterStatus,
    filterPriority,
    filterTags,
    searchQuery,
    // Getters
    filteredTasks,
    tasksByStatus,
    taskStats,
    // Actions
    fetchTasks,
    fetchTags,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addTag,
    setView,
    setFilterStatus,
    setFilterPriority,
    setFilterTags,
    setSearchQuery,
    clearFilters
  }
})
