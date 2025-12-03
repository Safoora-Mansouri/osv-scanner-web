<script setup lang="ts">
import { ref } from 'vue'
import FileUploadSection from './components/FileUploadSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import type { PackageJson } from './types/packageJson'
import type { PackageVulnerabilityResult } from './services/osvClient'
import { fetchVulnerabilitiesForPackage } from './services/osvClient'



const packageJson = ref<PackageJson | null>(null)
const results = ref<PackageVulnerabilityResult[]>([])
const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function handlePackageJsonLoaded(data: PackageJson) {
  packageJson.value = data
  results.value = []
  errorMessage.value = null

  const allDeps = {
    ...(data.dependencies ?? {}),
    ...(data.devDependencies ?? {})
  }

  const entries = Object.entries(allDeps)

  if (entries.length === 0) return

  loading.value = true

  try {
    const promises = entries.map(([name, version]) =>
      fetchVulnerabilitiesForPackage(name, version)
    )
    results.value = await Promise.all(promises)
  } catch (e) {
    errorMessage.value = 'Failed to fetch vulnerabilities from OSV.'
  } finally {
    loading.value = false
  }
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

  <div v-if="loading" class="mt-4 text-sm text-gray-600">
    Checking dependencies against OSV...
  </div>

  <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
    {{ errorMessage }}
  </p>

  <ResultsSection
    :package-json="packageJson"
    :results="results"
  />
</main>
  </div>
</template>