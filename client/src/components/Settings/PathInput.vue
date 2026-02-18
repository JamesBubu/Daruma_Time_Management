<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <div class="flex gap-2">
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder || t('settings.data.pathPlaceholder')"
        class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
      />
      <button
        @click="$emit('test')"
        :disabled="!modelValue || isTesting"
        class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        <span v-if="isTesting" class="flex items-center gap-1">
          <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ t('settings.data.testing') }}
        </span>
        <span v-else>{{ t('settings.data.test') }}</span>
      </button>
      <button
        @click="$emit('save')"
        :disabled="isSaving"
        class="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >{{ t('settings.save') }}</button>
    </div>

    <!-- Test result -->
    <div v-if="testResult" :class="[
      'flex items-start gap-2 text-xs rounded-lg px-3 py-2',
      testResult.ok
        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
    ]">
      <span class="mt-0.5 flex-shrink-0">{{ testResult.ok ? '✓' : '✕' }}</span>
      <span>{{ testResult.message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:      { type: String, required: true },
  modelValue: { type: String, default: '' },
  placeholder:{ type: String, default: '' },
  testResult: { type: Object, default: null },
  isTesting:  { type: Boolean, default: false },
  isSaving:   { type: Boolean, default: false },
  t:          { type: Function, required: true }
})

defineEmits(['update:modelValue', 'test', 'save'])
</script>
