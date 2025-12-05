<script setup lang="ts">
import { ref } from 'vue'
import FileUploadSection from './components/FileUploadSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import type { PackageJson } from './types/packageJson'
import Footer from './components/Footer.vue'
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
  
  <div class="min-h-screen bg-stone-100 text-gray-900">
   
<header class="py-4 px-6 bg-stone-100  flex flex-col items-center ">
<div class="flex items-center">
  <img src="/osv_logo.png" alt="OSV" class="w-20 h-20" />
  <!-- <h1 class="text-2xl font-semibold font-outfit text-emerald-700 ml-0">
    osv scanner web
  </h1> -->
</div>
  <!-- <p class="text-sm text-gray-600 text-center animate-fade-up">
    Upload your package.json to scan dependencies using OSV.dev.
  </p> -->
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
   <Footer />
</template>