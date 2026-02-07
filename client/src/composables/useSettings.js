import { ref } from 'vue'
import { locales, localeNames, defaultLocale } from '../locales/index.js'

// Shared reactive state (module level)
const currentLocale = ref(localStorage.getItem('locale') || defaultLocale)
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

// Apply dark mode class to document
function applyDarkMode(dark) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize dark mode on load
applyDarkMode(isDarkMode.value)

export function useSettings() {
  function t(key) {
    const messages = locales[currentLocale.value] || locales[defaultLocale]
    const keys = key.split('.')
    let value = messages
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }
    return value || key
  }

  function setLocale(newLocale) {
    if (locales[newLocale]) {
      currentLocale.value = newLocale
      localStorage.setItem('locale', newLocale)
    }
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', String(isDarkMode.value))
    applyDarkMode(isDarkMode.value)
  }

  function setDarkMode(dark) {
    isDarkMode.value = dark
    localStorage.setItem('darkMode', String(dark))
    applyDarkMode(dark)
  }

  return {
    locale: currentLocale,
    darkMode: isDarkMode,
    localeNames,
    t,
    setLocale,
    toggleDarkMode,
    setDarkMode
  }
}
