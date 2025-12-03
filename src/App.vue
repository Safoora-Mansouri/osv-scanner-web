<script setup lang="ts">
import { ref } from 'vue'
import FileUploadSection from './components/FileUploadSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import type { PackageJson } from './types/packageJson'

const packageJson = ref<PackageJson | null>(null)

function handlePackageJsonLoaded(data: PackageJson) {
  packageJson.value = data
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <header class="py-4 px-6 bg-white shadow">
      <h1 class="text-2xl font-semibold">
        Package.json Vulnerability Scanner
      </h1>
      <p class="text-sm text-gray-600">
        Upload your package.json to scan dependencies using OSV.dev.
      </p>
    </header>

    <main class="p-6 max-w-4xl mx-auto">
      <FileUploadSection @package-json-loaded="handlePackageJsonLoaded" />
      <ResultsSection :package-json="packageJson" />
    </main>
  </div>
</template>