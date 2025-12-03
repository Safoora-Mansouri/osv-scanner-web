<template>
  <section class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-lg font-semibold mb-2">Upload package.json</h2>
    <p class="text-sm text-gray-600 mb-4">
      Select your package.json file from your local machine.
    </p>

    <input
      type="file"
      accept=".json"
      @change="onFileChange"
      class="block"
    />

    <p v-if="error" class="text-red-600 text-sm mt-2">
      {{ error }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PackageJson } from '../types/packageJson'

const error = ref<string | null>(null)

const emit = defineEmits<{
  (e: 'package-json-loaded', data: PackageJson): void
}>()

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (file.name !== 'package.json') {
    error.value = 'Please select a package.json file.'
    return
  }

  error.value = null

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const text = reader.result as string
      const json = JSON.parse(text) as PackageJson
      emit('package-json-loaded', json)
    } catch (e) {
      error.value = 'Invalid JSON file.'
    }
  }

  reader.readAsText(file)
}
</script>

