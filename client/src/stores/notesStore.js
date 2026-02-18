import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const isLoading = ref(false)
  const selectedNoteId = ref(null)

  const selectedNote = computed(() => {
    return notes.value.find(n => n.id === selectedNoteId.value) || null
  })

  async function fetchNotes() {
    isLoading.value = true
    try {
      const res = await fetch('/api/notes')
      notes.value = await res.json()
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createNote(data = {}) {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const newNote = await res.json()
      notes.value.push(newNote)
      selectedNoteId.value = newNote.id
      return newNote
    } catch (err) {
      console.error('Failed to create note:', err)
    }
  }

  async function updateNote(id, data) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const updated = await res.json()
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) notes.value[index] = updated
      return updated
    } catch (err) {
      console.error('Failed to update note:', err)
    }
  }

  async function deleteNote(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      notes.value = notes.value.filter(n => n.id !== id)
      if (selectedNoteId.value === id) selectedNoteId.value = null
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  async function linkTask(noteId, taskId) {
    try {
      const res = await fetch(`/api/notes/${noteId}/link-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      const updated = await res.json()
      const index = notes.value.findIndex(n => n.id === noteId)
      if (index !== -1) notes.value[index] = updated
      return updated
    } catch (err) {
      console.error('Failed to link task:', err)
    }
  }

  async function unlinkTask(noteId, taskId) {
    try {
      const res = await fetch(`/api/notes/${noteId}/link-task/${taskId}`, {
        method: 'DELETE'
      })
      const updated = await res.json()
      const index = notes.value.findIndex(n => n.id === noteId)
      if (index !== -1) notes.value[index] = updated
      return updated
    } catch (err) {
      console.error('Failed to unlink task:', err)
    }
  }

  function selectNote(id) {
    selectedNoteId.value = id
  }

  return {
    notes,
    isLoading,
    selectedNoteId,
    selectedNote,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    linkTask,
    unlinkTask,
    selectNote
  }
})
