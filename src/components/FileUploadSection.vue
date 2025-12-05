<template>
  <section
    class="  flex flex-col  bg-stone-200 rounded-xl shadow-md p-6 mb-6
           border border-emerald-200 hover:shadow-lg
           transition-shadow duration-300 items-center"
  >
    <h2 class="text-xl font-bold text-emerald-800 mb-6">
      Upload <span class="">package.json</span>
    </h2>

    <!-- <p class="text-sm text-slate-700 mb-4">
      Select your
      <code class="text-emerald-700 font-medium">package.json</code>
      file from your computer.
    </p> -->

    <!-- Emerald + soft blue upload button -->
    <label
      class="flex items-center justify-center w-full px-4 py-3
             bg-teal-700
             text-emerald-800 border border-emerald-300 rounded-lg
             cursor-pointer hover:from-emerald-200 hover:to-cyan-200
             transition-colors duration-200 font-medium gap-2"
    >
      <!-- SVG icon -->
      <svg
        class="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <span class="text-white">Select file</span>

      <input
        type="file"
        accept=".json"
        @change="onFileChange"
        class="hidden"
      />
    </label>

    <!-- Error message -->
    <p
      v-if="error"
      class="text-red-600 text-sm mt-3
             bg-red-100 border border-red-300
             rounded-md p-2"
    >
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
